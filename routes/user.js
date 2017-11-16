var express = require('express');
var router = express.Router();

const Action = require('../src/common/methods');
const userMethod = require('../src/control/user');

/* Handle user login */
router.post('/login', function(req, res, next) {
  console.log('user');
  res.send('respond with a resource');
});

/*Handle user add*/
router.post('/add', (req, res, next) => {
  console.log(req.body);
  userMethod.handleAdd(req, res);
});

/*handle user modify*/
router.put('/modify/:userId', (req, res, next) => {
  userMethod.modifyUser(req, res)
});

/*GET users listing.*/
module.exports = router;
