/**!
 * logger - lib/logger.js
 *
 * Copyright(c) 2012 - 2014 Alibaba Group Holding Limited.
 *
 * Authors:
 *   苏千 <suqian.yf@taobao.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var tty = require('tty');
var utility = require('utility');
var address = require('address');
var ms = require('ms');
var fs = require('fs');
var path = require('path');
var util = require('util');
var logfilestream = require('logfilestream');
var formater = require('error-formater');
var os = require('os');
var urllib = require('urllib');

var supportColor = tty.isatty(1) || process.env.DEBUG_COLORS;

var logger = {};

module.exports = logger;

logger._streams = [];
logger.enable = true; // you can disable it on running.
logger.enableAccesslog = false;

logger.ALL = -10000;
logger.DEBUG = -1;
logger.LOG = 0;
logger.INFO = 0;
logger.WARN = 1;
logger.ERROR = 2;
logger.TRACE = 3;
logger._level = logger.INFO;
logger._stdoutLevel = 10000; // default is never to stdout

logger.methods = [
  { name: 'debug', level: logger.DEBUG, color: 0 },
  { name: 'info', level: logger.INFO, color: 6 }, // log as info by default
  { name: 'warn', level: logger.WARN, color: 3, },
  { name: 'error', level: logger.ERROR, color: 1 },
];

logger.addMethods = function (methods) {
  if (!Array.isArray(methods)) {
    methods = [methods];
  }
  methods.forEach(function (m) {
    var name = m;
    var level = logger.TRACE;
    if (typeof m !== 'string') {
      name = m.name;
      level = m.level || logger.TRACE;
    }

    logger.methods.push({
      name: name,
      level: level
    });
  });
};

logger.setLevel = function (level) {
  if (typeof level === 'number') {
    logger._level = level;
  }
};

logger.setStdoutLevel = function (level) {
  if (typeof level === 'number') {
    logger._stdoutLevel = level;
  }
};

logger.end = function () {
  this._streams.forEach(function (s) {
    s.end();
  });
};

var createStream = function (opts, name) {
  var streamOptions = {
    logdir: opts.logdir,
    duration: opts.duration,
    // using momentjs date format: http://momentjs.com/docs/#/displaying/format/
    nameformat: opts.nameformat.replace('{{level}}', name)
  };
  var stream = logfilestream(streamOptions);
  stream.on('error', function (err) {
    // if disk error, only can do is show error log to stderr.
    console.error('[%s] [%s] %s', Date(), process.pid, err.stack || err);
  });
  logger._streams.push(stream);
  return stream;
};

logger.init = function init(options) {
  var ONE_DAY = ms('1d');

  options.logdir = options.logdir;
  if (!fs.existsSync(options.logdir)) {
    fs.mkdirSync(options.logdir);
  }
  options.duration = options.duration || ONE_DAY;
  options.nameformat = options.nameformat || '[{{level}}.]YYYY-MM-DD[.log]';
  var isDevelopment = process.env.NODE_ENV === 'debug' || process.env.NODE_ENV === 'development';
  if (typeof options.level !== 'number') {
    options.level = logger.INFO;
    if (isDevelopment) {
      options.level = logger.DEBUG;
    }
  }
  if (typeof options.stdoutLevel !== 'number') {
    if (isDevelopment) {
      options.stdoutLevel = logger.DEBUG;
    }
  }
  logger.setLevel(options.level);
  logger.setStdoutLevel(options.stdoutLevel);

  if (options.methods) {
    logger.addMethods(options.methods);
  }

  if (options.accessLog) {
    options.accessLogDuration = options.accessLogDuration || options.duration;
    options.accessLogNameformat = options.accessLogNameformat || options.nameformat;
    logger._accessLogStream = createStream({
      logdir: options.logdir,
      duration: options.accessLogDuration,
      nameformat: options.accessLogNameformat,
    }, 'access');
    logger.enableAccesslog = true;
  }

  var hasLogMethod = false;

  logger.methods.forEach(function (catetory) {
    if (catetory.name === 'log') {
      hasLogMethod = true;
    }

    var stream = createStream(options, catetory.name);
    function write(msg) {
      if (!logger.enable || !msg || logger._level > catetory.level) {
        return;
      }

      // var date = moment();
      // var time = date.format('YYYY-MM-DD HH:mm:ss.SSS');
      var time = utility.logDate();
      if (msg instanceof Error) {
        if (options.stderr && msg.message.indexOf('mock') < 0) {
          console.error(msg.stack);
        }
        var err = msg;
        msg = formater(err);
      } else {
        // normal log: `YYYY-MM-DD HH:mm:ss.SSS [PID] message string...`
        msg = time + ' [' + process.pid + '] ' + util.format.apply(util, arguments) + '\n';
      }
      if (msg) {
        stream.write(msg);
        if (logger._stdoutLevel <= catetory.level) {
          msg = '[' + catetory.name + '] ' + msg;
          if (supportColor) {
            msg = '\u001b[9' + catetory.color + 'm' + msg + '\u001b[0m';
          }
          process.stdout.write(msg);
        }
      }
    }

    logger[catetory.name] = write;
  });

  // if not log method, link info to log
  if (!hasLogMethod) {
    logger.log = logger.info;
  }
};

logger.ACCESS_LOG_FORMAT = /^[\w\.\-]+ \d+ [\d\-]+ \[\d{2}\/\w{3}\/\d{4}\:\d{2}\:\d{2}\:\d{2} [\+\-]\d{4}\] \"\w{3,8} [^\"]+\" \d+ [\d\-]+ \"[^\"]+\" \"[^\"]+\"$/;
logger.ACCESS_LOG_EXTRA_FORMAT = /^[\w\.\-]+ \d+ [\d\-]+ \[\d{2}\/\w{3}\/\d{4}\:\d{2}\:\d{2}\:\d{2} [\+\-]\d{4}\] \"\w{3,8} [^\"]+\" \d+ [\d\-]+ \"[^\"]+\" \"[^\"]+\" \d+ \d+$/;

logger.accessLog = function (ip, usec, method, url, status, bytes, referer, userAgent) {
  if (!this.enable || !this.enableAccesslog) {
    return;
  }

  bytes = bytes || '-';
  referer = referer || '-';
  userAgent = userAgent || '-';

  // format: {ip} {usec} {pid} [{logdate}] "{method} {url}" {status} {bytes} "{referer}" "{userAgent}"
  var log = ip + ' ' + usec + ' ' + process.pid +
    ' [' + utility.accessLogDate() + '] "' +
    method + ' ' + url + '" ' + status + ' ' + bytes + ' "' + referer + '" "' + userAgent + '"\n';

  // util.format: log.accessLog() x 49,913 ops/sec ±5.14% (80 runs sampled)
  // string plus: log.accessLog() x 87,713 ops/sec ±7.32% (73 runs sampled)
  log && this._accessLogStream.write(log);
};

logger.accessLogExtra = function (ip, usec, method, url, status, bytes, referer, userAgent, hitCache, backendTime) {
  if (!this.enable || !this.enableAccesslog) {
    return;
  }

  bytes = bytes || '-';
  referer = referer || '-';
  userAgent = userAgent || '-';

  // format: {ip} {usec} {pid} [{logdate}] "{method} {url}" {status} {bytes} "{referer}" "{userAgent}" {hitcache} {backendtime}
  var log = ip + ' ' + usec + ' ' + process.pid +
    ' [' + utility.accessLogDate() + '] "' +
    method + ' ' + url + '" ' + status + ' ' + bytes + ' "' + referer + '" "' + userAgent + '" ' +
    hitCache + ' ' + backendTime + '\n';

  // util.format: log.accessLog() x 49,913 ops/sec ±5.14% (80 runs sampled)
  // string plus: log.accessLog() x 87,713 ops/sec ±7.32% (73 runs sampled)
  log && this._accessLogStream.write(log);
};

/**
 * connect access log middleware
 *
 * @param {Object} options
 *  - {Object} [timer] impl `now()`, default is `Date`
 *  - {String} [method] access log method, default is 'accessLog',
 *      you can set 'accessLogExtra' if you want to log backend time
 *  - {Array} [resHeaders] append res headers to request url, default is empty
 * @return {Function(req, res, next)}
 */
logger.accessLogMiddleware = function (options) {
  options = options || {};
  var timer = options.timer || Date;
  var method = options.method || 'accessLog';
  var resHeaders = options.resHeaders || [];
  return function (req, res, next) {
    var start = timer.now();
    var end = res.end;
    res.accessLogBackendTime = 0;
    res.accessLogHitCache = 0;
    var ip = req.ip;
    if (!ip) {
      ip = req.connection && req.connection.remoteAddress;
      if (!ip) {
        var sock = req.socket;
        if (sock.socket) {
          ip = sock.socket.remoteAddress;
        } else {
          ip = sock.remoteAddress || '-';
        }
      }
    }

    res.end = function (chunk, encoding) {
      res.end = end;
      res.end(chunk, encoding);

      if (!logger.enableAccesslog) {
        return;
      }

      var usec = timer.now() - start;
      var bytes = parseInt(res.getHeader('Content-Length'), 10);
      var url = req.originalUrl || req.url;
      if (resHeaders.length) {
        if (url.indexOf('?') < 0) {
          url += '?';
        }
        for (var i = 0; i < resHeaders.length; i++) {
          var h = resHeaders[i];
          var v = res.getHeader(h);
          if (v) {
            url += '&' + h + '=' + v;
          }
        }
      }
      logger[method](ip, usec, req.method, url, res.statusCode,
        bytes,
        req.headers.referer || req.headers.referrer,
        req.headers['user-agent'],
        res.accessLogHitCache, res.accessLogBackendTime);
    };
    next();
  };
};

module.exports = logger;
