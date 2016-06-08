var passport = require('passport');
var userCtl = require('../app/controllers/user');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {

  passport.serializeUser(function(user, done) {
	done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
	userCtl.getUserById(+id)
	.then(function(user) {
	  done(null, user);
	})
	.catch(function(err) {
	  done(err);
	});
  });

  passport.use(new LocalStrategy(
	function(username, password, done) {
	  process.nextTick(function() {
	    userCtl.auth({
		  username: username,
		  password: password
		})
		.then(function(result) {
		  if (result.isAuth) {
		  	done(null, result.user);
		  } else {
		    done(null, false, {message: result.message});
		  }
		})
		.catch(function(err) {
		  done(err);  
		});
	  });
	}			  
  ));

  app.use(passport.initialize());
  app.use(passport.session());

  // 登录的路由
  app.post('/user/login', 
    passport.authenticate('local', {failureRedirect: '/user/login'}), 
	function(req, res) {
	  res.redirect('/user/account');
	}
  );

};
