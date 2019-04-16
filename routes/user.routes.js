const express = require('express');
const router = express.Router();

const verifyToken = require('../security/verify-token');

const UserController = require('../controllers/user.controller');

// These routes do not require any authentication
router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);

// This route uses verifyToken as middleware to authorize a user
router.post('/profile', verifyToken, UserController.profile);

module.exports = router;