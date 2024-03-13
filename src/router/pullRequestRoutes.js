const express = require('express');
const router = express.Router();
const pullRequestController = require('../controller/pullRequestController');

router.post('/fileChanges', pullRequestController.getFileChanges);

module.exports = router;