const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/userController');

router.get('/add', userController.addUser);
router.post('/authenticate', userController.authenticateUser);
router.post('/register',userController.registerUser);
router.post('/login', userController.loginUser);


module.exports = router;
