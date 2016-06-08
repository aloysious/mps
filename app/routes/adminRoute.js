var express = require('express');
var router = express.Router();

var adminController = require('../controllers/adminController');

router.get('/test', function(req, res) {
	res.render('test');
});

router.get('/:id', function(req, res) {
	adminController.getAdminById(req.params.id || null)
	.then(function(admin) {
		res.json(admin);
	})
	.catch(function(err) {
		res.json(err);	
	});
});

module.exports = router;
