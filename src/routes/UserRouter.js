const express = require('express');
const router = express.Router()
const userContronller = require('../controllers/UserController');
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/sign-up', userContronller.createUser);
router.post('/sign-in', userContronller.loginUser);
router.put('/update-user/:id', userContronller.updateUser);
router.delete('/delete-user/:id', authMiddleware, userContronller.deleteUser);
router.get('/getAll', authMiddleware, userContronller.getAllUser);
router.get('/get-details/:id', authUserMiddleware, userContronller.getDetailsUser);
router.post('/refresh-token', userContronller.refreshToken);

module.exports = router;