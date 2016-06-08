var express = require('express');
var router = express.Router();

var userCtl = require('../controllers/user');
var checkLogin = require('../../middlewares/checklogin');

router.get('/register', function(req, res) {});
router.get('/login', function(req, res) {});
router.get('/logout', function(req, res) {});
router.get('/account', checkLogin(), function(req, res) {});

router.get('/test', function(req, res) {

	userCtl.signUp(req.query)
	.then(function(user) {
		if (user) {
			res.send('success!');
		} else {
			res.send('fail!');
		}
	})
	.catch(function(err) {
		res.send(err.message);
	})

});

module.exports = router;
