var express = require('express');
var router = express.Router();

const normalAdd = require('../src/control/equip')

router.get('/normalEquip', (req, res) => {
    normalAdd.handleNormalGet(req, res)
})

router.post('/normalEquip', (req, res) => {
    normalAdd.handleNormalAdd(req, res)
});

router.put('/normalEquip', (req, res) => {
    normalAdd.handleNormalModify(req, res);
});

module.exports = router;