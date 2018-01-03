/**
 * Created by admin on 2018/1/3.
 */
var express = require('express');
var router = express.Router();
var ascription = require('../src/control/ascription');

router.get('/',function(req, res, next) {
    ascription.getInAscription(res);
})

router.get('/brief',function(req, res, next) {
    ascription.getBriefInfo(res);
})

module.exports = router;