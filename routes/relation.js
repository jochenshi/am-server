const express = require('express');
const router = express.Router();

const relate = require('../src/control/machineFitting');

router.post('/delete', (req, res) => {
    relate.handleDelete(req, res);
})

module.exports = router;