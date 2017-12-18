var express = require('express');
var router = express.Router();

const normalAdd = require('../src/control/equip')

router.post('/normalEquip', (req, res) => {
    normalAdd.handleNormalAdd(req, res)
});

module.exports = router;