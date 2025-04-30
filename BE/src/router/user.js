const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/userController');

router.get('/add', userController.addUser);
router.post('/authenticate', userController.authenticateUser);
router.post('/register',userController.registerUser);
router.post('/login', userController.loginUser);
//create token reset pass
router.post('/create-token', userController.createTokenResetpassword);
router.post('/verify-token', userController.verifyToken);
router.post('/reset-password', userController.resetPassword);


module.exports = router;
