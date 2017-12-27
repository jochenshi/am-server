var express = require('express');
var router = express.Router();

const authen = require('../src/control/authority');

router.get('/', (req, res) => {
    authen.getAuthority(req, res)
});

module.exports = router;