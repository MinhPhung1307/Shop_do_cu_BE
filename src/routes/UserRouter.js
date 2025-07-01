const express = require('express');
const router = express.Router()
const userContronller = require('../controllers/UserController');
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/sign-up', userContronller.createUser);
router.get('/verify-email', userContronller.verifyEmail);
router.post('/sign-in', userContronller.loginUser);
router.post('/log-out', userContronller.logoutUser);
router.put('/update-user/:id', authUserMiddleware, userContronller.updateUser);
router.delete('/delete-user/:id', authMiddleware, userContronller.deleteUser);
router.get('/getAll', authMiddleware, userContronller.getAllUser);
router.get('/get-details/:id', authUserMiddleware, userContronller.getDetailsUser);
router.post('/refresh-token', userContronller.refreshToken);


module.exports = router;