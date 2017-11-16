var express = require('express');
var router = express.Router();

const models = require('../src/models');
const Action = require('../src/common/methods');
const userMethod = require('../src/control/user')

/* GET users listing. */
router.post('/login', function(req, res, next) {
  console.log('user');
  res.send('respond with a resource');
});

router.post('/add', (req, res, next) => {
  console.log(req.body);
  userMethod.handleAdd(req, res);
})

module.exports = router;
