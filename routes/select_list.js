var express = require('express');
var router = express.Router();
var select = require('../src/control/select_list');

/* GET users listing. */
router.get('/',function(req, res, next) {
	select.getSelectData(res);
})

router.post('/add', function(req, res, next) {
    select.addSelect(req.body,res);
});

router.get('/verifySelect',function(req, res, next) {
	console.log(req.query);
	select.verifySelectExist(req.query,res);
})

module.exports = router;
