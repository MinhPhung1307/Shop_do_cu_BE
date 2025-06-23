const express = require('express');
const router = express.Router()
const productContronller = require('../controllers/ProductController');
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');

router.post('/create', productContronller.createProduct);
router.put('/update/:id', authUserMiddleware, productContronller.updateProduct);
router.get('/get-details/:id', productContronller.getDetailsProduct);
router.delete('/delete/:id', productContronller.deleteProduct);
router.get('/getAll', productContronller.getAllProduct);


module.exports = router;