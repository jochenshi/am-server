var express = require('express');
var router = express.Router();

const Action = require('../src/common/methods');
const userMethod = require('../src/control/user');
const loginMethod = require('../src/control/login');

/* Handle user login */
router.post('/login', function(req, res, next) {
  console.log('go in user');
  loginMethod.handleLogin(req, res);
  //res.send('respond with a resource');
});

//退出登录的请求
router.get('/loginOut', (req, res) => {
  loginMethod.handleLoginOut(req, res);
})

//查询登录的用户名以及账号
router.get('/userName', (req, res) => {
  loginMethod.getUserName(req, res);
})

/*Handle user add*/
router.post('/add', (req, res, next) => {
  console.log(req.body);
  userMethod.handleAdd(req, res);
});

/*handle user modify*/
router.put('/modify/:userId', (req, res, next) => {
  userMethod.modifyUser(req, res)
});

//查询添加用户时的角色的选项
router.get('/role', (req, res, next) => {
  userMethod.getRoleOption(req, res);
})

router.get('/all', (Req, res) => {
  userMethod.getUsers(req, res);
})

/*GET users listing.*/
module.exports = router;
