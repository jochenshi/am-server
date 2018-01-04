var express = require('express');
var router = express.Router();

const normalAdd = require('../src/control/equip')

router.get('/normalEquip', (req, res) => {
    normalAdd.handleNormalGet(req, res)
})

router.post('/normalEquip', (req, res) => {
    normalAdd.handleNormalAdd(req, res)
});

router.put('/normalEquip/:id', (req, res) => {
    normalAdd.handleNormalModify(req, res);
});

router.post('/supplyEquip', (req, res) => {
    normalAdd.handleSupplyAdd(req, res);
})

router.get('/supplyEquip', (req, res) => {
    normalAdd.handleSupplyGet(req, res);
})

module.exports = router;