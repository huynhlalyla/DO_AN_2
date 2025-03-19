const express = require('express');
const router = express.Router();
const userController = require('../app/controller/userController');

// Định tuyến và gọi controller
router.get('/add', userController.addUser);
router.post('/auth', userController.authenticateUser);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
