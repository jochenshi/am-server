var express = require('express');
var router = express.Router();

const models = require('../common/models');
const Action = require('../common/service/methods');
const userMethod = require('../common/control/user')

/* GET users listing. */
router.post('/login', function(req, res, next) {
  console.log('user');
  res.send('respond with a resource');
});

router.post('/add', (req, res, next) => {
  console.log(req);
  console.log(req.body);
  res.send('get add user request')
})

module.exports = router;
