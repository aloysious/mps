var express = require('express');
var router = express.Router();
var config = require('../../config/config');

router.get('/test', function(req, res) {
	res.render('test', {
		currentUser: JSON.stringify(req.session[config.userKey])
	});
});

module.exports = router;
