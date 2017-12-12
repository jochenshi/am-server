var express = require('express');
var router = express.Router();
var select = require('../src/control/select_list');

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
module.exports = router;
