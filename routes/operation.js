var express = require('express');
var router = express.Router();
const logger = require('../src/config/log');

const operation = require('../src/control/operate_record');

router.get('/', (req, res) => {
    operation.handleOperateGet(req, res);
})

module.exports = router;