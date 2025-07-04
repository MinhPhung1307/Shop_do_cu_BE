const express = require("express");
const router = express.Router();
const productContronller = require("../controllers/ProductController");
const {
  authMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");
const multer = require("multer");

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Thư mục lưu file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Thay đổi route tạo sản phẩm:
router.post(
  "/create",
  upload.array("images", 10), // nhận tối đa 5 file với field "images"
  productContronller.createProduct
);
router.put("/update/:id", authUserMiddleware, productContronller.updateProduct);
router.get("/get-details/:id", productContronller.getDetailsProduct);
router.delete("/delete/:id", productContronller.deleteProduct);
router.get("/getproduct", productContronller.getAllProduct);

router.delete("/deletes", productContronller.deleteAllProduct);

module.exports = router;
