/**
 * Created by admin on 2017/12/21.
 */
var express = require('express');
var router = express.Router();
var address = require('../src/control/address');

router.get('/',function(req, res, next) {
    address.getAddress(req.query, res);
})

router.post('/',function(req, res, next) {
    address.addAddress(req.body, res);
})

router.put('/',function(req, res, next) {
    address.modifyAddress(req.body, res);
})

module.exports = router;