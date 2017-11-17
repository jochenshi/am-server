var express = require('express');
var router = express.Router();

var models = require('../src/models')
var Action = require('../src/common/methods')
console.log(models.user)

// const Sequelize = require('sequelize');
// const User = require('../common/models/user_info')

// const sequelize = new Sequelize('test_asset', 'root','unis123',{
//   host: '192.168.232.79',
//   dialect: 'mysql',
//   timezone: '+8:00'
// })

// sequelize.authenticate().then(() => {
//   console.log('conection ok')
// })
// .catch(err => {
//   console.error('connection failed', err)
// })

// const User = sequelize.define('user_infos', {
//   name: {
//     type: Sequelize.STRING
//   },
//   sex: {
//     type: Sequelize.STRING
//   }
// });


// User.sync().then(() => {
//   return User.create({
//     name: 'tom3',
//     sex: 'male'
//   })
// });

// User.findAll().then((usres) => {
//   console.log(usres);
// })

/* handle user requests from front end. */
router.get('/', function(req, res, next) {
  //models.sequelize.sync(); // this is for test initialize all tables at the same time, this will be move to other place after
  //models.Users.sync();
  (async () => {
    var test = await models.sequelize.sync({force: false});
    res.send('initialize table ok')
    // var select = await models.user.findAll({
    //   where: {
    //     $or: [
    //       {
    //         name: 'test3'
    //       },
    //       {
    //         account: 'account2'
    //       }
    //     ]
    //   }
    // });
    // if (select.length) {
    //   res.send(JSON.stringify(select));
    //   console.log('user already exist')
    // } else {
    //   var now = Date.now();
    //   var result = await models.user.create({
    //     id: 'user_' + now,
    //     name: 'test2',
    //     account: 'account2',
    //     createTime: now,
    //     updateTime: now,
    //     password: 'account2',
    //     isValid: true
    //   }).catch(err => {res.send(err)});
    //   console.log('add user success');
    //   res.send(JSON.stringify(result));
    //   //console.log(JSON.stringify(result))
    // }
  })()
  // models.Users.findAll({
  //   where: {
  //     name: 'test2'
  //   }
  // }).then(val => {
  //   if (val.length) {
  //     res.send(val)
  //     console.log('user already exists')
  //   } else {
  //     models.Users.create({
  //       name: 'test2',
  //       account: 'account2',
  //       password: 'password2'
  //     }).then((val) => {
  //       res.send('add data success')
  //       console.log('add new data success')
  //     })
  //   }
  // }).catch(err => {
  //   console.log('err', err)
  // })
  console.log('go in am route')
  //res.send('server has already accept requests from the front end');
});

// handle user login request
router.post('/user/login', function(req, res, next){
  //var text = Action.verifyUserAdd(req.body);
  console.log(req.body)
  res.send(req.body)
})

module.exports = router;