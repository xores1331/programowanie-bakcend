const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/about', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'about.html'));
});


module.exports = router;