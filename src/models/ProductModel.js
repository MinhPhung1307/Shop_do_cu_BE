const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    // sau: cho phép mảng ảnh
    images: [{ type: String, required: true }],
    // array of URLs/paths
    name: { type: String, required: true },
    price: { type: Number, required: true },
    used: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: "Chờ duyệt" },
    _iduser: { type: String, required: true },
    // danh sách đấu giá
    bids: [
      {
        amount: { type: Number },
        bidderId: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    auctionEndTime: { type: Date, default: null }, // Trường mới để lưu thời gian kết thúc đấu giá
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
