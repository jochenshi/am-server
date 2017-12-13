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