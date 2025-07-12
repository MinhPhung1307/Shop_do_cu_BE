const express = require("express");
const router = express.Router();
const multer = require("multer"); // Đảm bảo đã require multer
const productController = require("../controllers/ProductController");
const {
  authMiddleware,
  authUserMiddleware,
  authLoggedInUser,
} = require("../middleware/authMiddleware");

// Import từ file cloudinary.js
const { storage } = require("../config/cloudinary"); // Đường dẫn phải đúng

// Khởi tạo multer với Cloudinary storage
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB/file
});

// Route tạo sản phẩm với upload ảnh
router.post(
  "/create",
  upload.array("images", 5), // Cho phép tối đa 5 ảnh
  productController.createProduct
);

// Các route khác giữ nguyên...
router.put("/update/:id", authUserMiddleware, productController.updateProduct);
router.get("/get-details/:id", productController.getDetailsProduct);
router.delete("/delete/:id", authLoggedInUser, productController.deleteProduct);
router.get("/getproduct", productController.getAllProduct);
router.get("/get-allproduct", authMiddleware, productController.getAllProducts);
router.get(
  "/getproduct-check",
  authMiddleware,
  productController.getAllProductCheck
);
router.put("/update-state/:id", authMiddleware, productController.updateState);
router.delete("/deletes", productController.deleteAllProduct);
router.put("/bid/:id", productController.placeBid);
router.put("/mark-as-sold/:id", authLoggedInUser, productController.markAsSold);
router.get("/auction", productController.getAuctionProducts);
router.put("/cancel-bid/:id", productController.cancelBid);
router.get("/bought-by-user/:userId", productController.getBoughtProducts);

module.exports = router;
