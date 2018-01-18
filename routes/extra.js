var express = require('express');
var router = express.Router();
const extra = require('../src/control/extra')

//添加附加信息
router.post('/', function (req, res, next) {
    extra.addExtra(req, res);
})

//获取附加信息
router.get('/', function (req, res, next) {
    extra.getExtra(req, res);
})

//修改附件的信息
router.put('/:id', function (req, res, next) {
    extra.modifyExtra(req, res);
})

module.exports = router;