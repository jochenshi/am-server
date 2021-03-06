var express = require('express');
var router = express.Router();
var select = require('../src/control/select_list');

router.get('/title',function(req, res, next){
    select.getSelectDataTitle(res);
});

router.get('/code',function(req,res,next){
    select.getSelectDataByCode(req.query.code,res);
});

/* GET listing. */
router.get('/',function(req, res, next) {
	select.getSelectData(res);
})
/**
 * 添加
 */
router.post('/', function(req, res, next) {
    select.addSelect(req.body,res);
});

/**
 * 验证
 */
router.get('/verifySelect',function(req, res, next) {
	select.verifySelectExist(req.query,res);
})

/**
 * 批量删除
 */
router.delete('/', function(req, res, next) {
    select.deleteSelect(req.query,res);
});

/**
 * 删除
 */
router.delete('/:id', function(req, res, next) {
    select.deleteSelect(req.params,res);
});

/**
 * 修改
 */
router.put('/', function(req, res, next) {
    select.updateSelect(req.body,res);
});

/**
 * 获取机器所需选项
 */
router.get('/machine',function(req, res, next){
   select.getMachineSelect(res);
});

// 获取普通配件的相关选项
router.get('/normalEquip', function (req, res, next) {
    select.getNormalEquipSelect(res);
});

//获取耗材类的配件的相关选项
router.get('/supplyEquip', function (req, res, next) {
    select.getSupplyEquipSelect(res);
})

module.exports = router;
