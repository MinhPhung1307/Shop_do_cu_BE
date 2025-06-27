const Product = require("../models/ProductModel");

// Tao sản phẩm mới
const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    // Các biến chứa các trường dữ liệu của sản phẩm mới
    const { name, image, type, price, description } = newProduct;
    try {
      // Tiến hành tạo mới
      const createdProduct = await Product.create({
        name, // tên sản phẩm
        image, // hình ảnh sản phẩm
        type, // loại sản phẩm
        price, // giá sản phẩm
        description, // mô tả sản phẩm
      });
      // Kiểm tra xem sản phẩm đã được tạo thành công hay chưa
      if (createdProduct) {
        resolve({
          status: "OK", // trạng thái thành công
          message: "Thành công", // thông báo thành công
          data: createdProduct,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Cập nhật sản phẩm
const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const CheckProduct = await Product.findOne({ _id: id }); // tạo biến chứa id sản phẩm cần cập nhật
      // kiểm tra xem sản phẩm có tồn tại hay không
      if (CheckProduct === null) {
        resolve({
          status: "OK", // trạng thái thành công
          message: "Sản phẩm không được xác định", // thông báo lỗi
        });
      }
      // nếu sản phẩm tồn tại thì tiến hành cập nhật
      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true, // trả về sản phẩm đã cập nhật
      });
      resolve({
        status: "OK", // trạng thái thành công
        message: "Thanh công", // thông báo thành công
        data: updatedProduct, // dữ liệu sản phẩm đã cập nhật
      });
    } catch (error) {
      reject(error);
    }
  });
};

// // Lấy chi tiết sản phẩm
const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ _id: id }); // tạo biến chứa id sản phẩm cần lấy chi tiết
      // kiểm tra xem sản phẩm có tồn tại hay không
      if (product === null) {
        resolve({
          status: "OK", // trạng thái thành công
          message: "Sản phẩm không được xác định", // thông báo lỗi
        });
      }
      resolve({
        status: "OK", // trạng thái thành công
        message: "Thanh công", // thông báo thành công
        data: product, // dữ liệu sản phẩm
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Xóa sản phẩm
const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const CheckProduct = await Product.findOne({ _id: id }); // tạo biến chứa id sản phẩm cần xóa
      // kiểm tra xem sản phẩm có tồn tại hay không
      if (CheckProduct === null) {
        resolve({
          status: "OK", // trạng thái thành công
          message: "Sản phẩm không được xác định", // thông báo lỗi
        });
      }
      // nếu sản phẩm tồn tại thì tiến hành xóa
      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK", // trạng thái thành công
        message: "Xóa sản phẩm thành công", // thông báo thành công
      });
    } catch (error) {
      reject(error);
    }
  });
};

//phân loại theo Phân loại
const getAllProduct = (limit = 2, page = 1, sort = null, filter = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();
      // điều kiện thỏa fillter
      if (filter) {
        const [field, value] = filter; // filler là trường dữ liệu và giá trị
        const allProductFilter = await Product.find({ [field]: value }) // tìm trường theo giá trị
          .limit(limit) // số lượng sản phẩm tối đa
          .skip(limit * (page - 1)) // bỏ qua số lượng sản phẩm đã hiển thị
          .lean(); // chuyển đổi kết quả thành đối tượng JavaScript thuần túy
        const totalFilter = await Product.countDocuments({ [field]: value }); // đếm số lượng sản phẩm theo điều kiện filter

        resolve({
          status: "OK", // trang thái thành công
          message: `Hiện sản phẩm thành công`, // thông báo
          data: allProductFilter, // dữ liệu sản phẩm
          total: totalFilter, // tổng số sản phẩm theo điều kiện filter
          pageCurrent: page, // trang hiện tại
          totalPage: Math.ceil(totalFilter / limit), // tổng số trang
        });
      }
      // điều kiện sắp xếp
      if (sort) {
        const objectSort = {}; // tạo một đối tượng để lưu trữ điều kiện sắp xếp
        objectSort[sort[1]] = sort[0]; // sort là mảng, phần tử đầu tiên là thứ tự sắp xếp (1 hoặc -1), phần tử thứ hai là trường dữ liệu cần sắp xếp
        const allProductSort = await Product.find() // tìm tất cả sản phẩm
          .limit(limit) // giới hạn số lượng sản phẩm tối đa
          .skip(limit * (page - 1)) // bỏ qua số lượng sản phẩm đã hiển thị
          .sort(objectSort); // sắp xếp theo điều kiện đã tạo
        resolve({
          status: "OK",
          message: "Lấy sản phẩm đã sắp xếp thành công",
          data: allProductSort, // dữ liệu sản phẩm đã sắp xếp
          total: totalProduct, // tổng số sản phẩm
          pageCurrent: page, // trang hiện tại
          totalPage: Math.ceil(totalProduct / limit), // tổng số trang
        });
      }
      // nếu không có điều kiện filter và sort thì lấy tất cả sản phẩm
      const allProduct = await Product.find()
        .limit(limit) // giới hạn số lượng sản phẩm tối đa
        .skip(limit * (page - 1)); // bỏ qua số lượng sản phẩm đã hiển thị
      resolve({
        status: "OK", // trạng thái thành công
        message: "Lấy tất cả sản phẩm thành công", // thông báo
        data: allProduct, // dữ liệu sản phẩm
        total: totalProduct, // tổng số sản phẩm
        pageCurrent: page, // trang hiện tại
        totalPage: Math.ceil(totalProduct / limit), // tổng số trang
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
};
