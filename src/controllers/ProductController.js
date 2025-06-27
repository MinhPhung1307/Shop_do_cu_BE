const ProductService = require("../services/ProductService");

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request
    const { name, image, type, price, description } = req.body;
    // Kiểm tra xem các trường dữ liệu có được cung cấp hay không
    if (
      !name ||
      !image ||
      !type ||
      !price ||
      !countInStock ||
      !rating ||
      !description
    ) {
      // Nếu không có trường nào được cung cấp, trả về lỗi
      return res.status(200).json({
        status: "ERR", // Trạng thái lỗi
        message: "Nhập đầy đủ thông tin sản phẩm", // Thông báo lỗi
      });
    }
    // Gọi Service để tạo sản phẩm mới
    const response = await ProductService.createProduct(req.body);
    // Trả về kết quả
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
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

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
};
