/**
 * Created by admin on 2018/1/4.
 */
var express = require('express');
var router = express.Router();
var use_record = require('../src/control/use_record');

router.get('/assignParam',function(req, res, next){
    use_record.getAssignParam(res);
});

router.post('/assign',function(req, res, next){
    use_record.assign(req.body,res);
});

module.exports = router;