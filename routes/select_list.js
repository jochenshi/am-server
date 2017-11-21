var express = require('express');
var router = express.Router();
var select = require('../src/control/select_list');

/* GET users listing. */
router.get('/',function(req, res, next) {
	select.getSelectData(res);
})

router.post('/', function(req, res, next) {
    select.addSelect(req.body,res);
});

router.get('/verifySelect',function(req, res, next) {
	select.verifySelectExist(req.query,res);
})

router.delete('/', function(req, res, next) {
    select.deleteSelect(req.query,res);
});

router.delete('/:id', function(req, res, next) {
    select.deleteSelect(req.params,res);
});

router.put('/', function(req, res, next) {
    select.updateSelect(req.body,res);
});

module.exports = router;
