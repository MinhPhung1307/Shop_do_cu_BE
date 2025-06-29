const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
        // access_token: { type: String, required: true },
        // refresh_token: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;