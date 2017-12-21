/**
 * Created by admin on 2017/12/11.
 */
var express = require('express');
var router = express.Router();
var machine = require('../src/control/machine');

/* GET listing. */
router.get('/',function(req, res, next) {
    machine.getMachineData(res);
})

router.get('/:id',function(req, res, next) {
    machine.getMachineDataById(req.params.id, res);
})

router.put('/:id',function(req, res, next) {
    machine.modifyMachine(req.params.id,req.body, res);
})


/* GET add param. */
router.get('/rdNumber',function(req, res, next) {
    machine.getAddMachineParam(res);
})

/**
 * 添加
 */
router.post('/', function(req, res, next) {
    machine.addMachine(req.body,res);
});

module.exports = router;