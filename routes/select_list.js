var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/addSelect', function(req, res, next) {
    console.log('user');
    res.send('respond with a resource');
});

router.post('/add', (req, res, next) => {
    console.log(req);
    console.log(req.body);
    res.send('get add user request')
})

module.exports = router;
