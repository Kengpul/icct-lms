const express = require('express');
const router = express.Router();
const profile = require('../controllers/profile');

router.get('/edit', profile.renderEditForm);

router.get('/', profile.index);

module.exports = router;