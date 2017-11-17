var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('index')
  res.render('index', { title: 'Express' });
  /*var html = path.normalize(__dirname + '/../build/index.html');
  res.sendFile(html);*/
});

module.exports = router;
