const express = require('express');
const router = express.Router();

const relate = require('../src/control/machineFitting');

router.put('/delete', (req, res) => {
    relate.handleDelete(req, res);
});

router.post('/add', (req, res) => {
    relate.handleRelateAdd(req, res)
})

module.exports = router;
