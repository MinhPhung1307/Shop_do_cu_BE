const ProductService = require("../services/ProductService");
const fs = require("fs");
// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    // Nếu dùng multer, req.files là mảng các file ảnh
    const images = req.files
      ? req.files.map((file) => file.path)
      : req.body.images;
    const { name, price, used, category, description, _iduser } = req.body;
    const priceNumber = Number(price); // chuyển sang số
    if (
      !images ||
      images.length === 0 ||
      !name ||
      !priceNumber ||
      !used ||
      !category ||
      !_iduser
    ) {
      if (req.files) {
        // forEach là phương thức duyệt qua từng phần tử
        req.files.forEach((file) => {
          try {
            // xóa file khi đăng thất bại
            fs.unlinkSync(file.path);
          } catch (err) {
            console.error("Xóa file thất bại:", file.path);
          }
        });
      }
      return res
        .status(400)
        .json({ status: "ERR", message: "Missing required fields" });
    }
    const product = await ProductService.createProduct({
      images,
      name,
      price: priceNumber,
      used,
      category,
      description,
      _iduser,
    });
    return res.status(201).json(product);
  } catch (error) {
    console.log(error);
    // XÓA FILE nếu có lỗi trong quá trình tạo sản phẩm
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Xóa file thất bại:", file.path);
        });
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    // Lấy productId từ tham số của request
    const productId = req.params.id;
    // Lấy dữ liệu từ body của request
    const data = req.body;
    // Kiểm tra xem productId có được cung cấp hay không
    if (!productId) {
      return res.status(200).json({
        status: "ERR", // Trạng thái lỗi
        message: "Không có ProductId", // Thông báo lỗi
      });
    }
    // Gọi Service để cập nhật sản phẩm
    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

// Lấy chi tiết sản phẩm
const getDetailsProduct = async (req, res) => {
  try {
    // Lấy productId từ tham số của request
    const productId = req.params.id;
    // Kiểm tra xem productId có được cung cấp hay không
    if (!productId) {
      return res.status(200).json({
        status: "ERR", // Trạng thái lỗi
        message: "Không có ProductId", // Thông báo lỗi
      });
    }
    // Gọi Service để lấy chi tiết sản phẩm
    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    // Lấy productId từ tham số của request
    const productId = req.params.id;
    // Kiểm tra xem productId có được cung cấp hay không
    if (!productId) {
      return res.status(200).json({
        status: "ERR", // Trạng thái lỗi
        message: "Không có ProductId", // Thông báo lỗi
      });
    }
    // Gọi Service để xóa sản phẩm
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

// Lấy tất cả sản phẩm
const getAllProduct = async (req, res) => {
  try {
    // Lấy các tham số giới hạn sản phẩm của trang, trang, điều kiện sắp xếp, bộ lọc từ query của request
    const { limit, page, sort, filter } = req.query;
    // Gọi Service để lấy tất cả sản phẩm
    const response = await ProductService.getAllProduct(
      Number(limit), // Giới hạn số lượng sản phẩm trên mỗi trang
      Number(page), // Số trang hiện tại
      sort, // Điều kiện sắp xếp
      filter // Bộ lọc sản phẩm
    );
    // Trả về kết quả
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

// Lấy tất cả sản phẩm chờ duyệt
const getAllProductCheck = async (req, res) => {
  try {
    const response = await ProductService.getAllProductCheck();
    // Trả về kết quả
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

// Xóa sản phẩm
const deleteAllProduct = async () => {
  try {
    // Gọi Service để xóa sản phẩm
    const response = await ProductService.deleteAllProduct();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

// hàm đấu giá
const placeBid = async (req, res) => {
  try {
    const productId = req.params.id;
    const { amount, bidderId } = req.body;

    if (!productId || !amount || !bidderId) {
      return res.status(400).json({
        status: "ERR",
        message: "Thiếu thông tin đặt giá",
      });
    }
    const response = await ProductService.placeBid(productId, {
      amount: Number(amount),
      bidderId,
    });

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "ERR",
      message: "Lỗi server",
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteAllProduct,
  getAllProductCheck,
  placeBid,
};
