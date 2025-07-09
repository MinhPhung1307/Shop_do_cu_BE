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
    status: { type: String, default: "check" },
    _iduser: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
