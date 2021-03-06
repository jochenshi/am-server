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

router.put('/withdraw',function(req, res, next){
    use_record.withdraw(req.body,res);
});

router.post('/assignEquip',function(req, res, next){
    use_record.assignEquip(req.body,res);
});

router.put('/withdrawEquip',function(req, res, next){
    use_record.withdrawEquip(req.body,res);
});

router.get('/',function(req, res, next){
    use_record.getUseRecord(req.query, res);
});

module.exports = router;