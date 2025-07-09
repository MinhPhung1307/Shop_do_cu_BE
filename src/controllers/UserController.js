const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");
const mongoose = require("mongoose");
const User = require("../models/UserModel");

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, address, phone } = req.body;
    const isCheckEmail = /^[a-zA-Z0-9._%+-]+@ut\.edu\.vn$/;
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !address ||
      !phone
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }  
    if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is Email UTH",
      });
    } 
    if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "Xác nhận mật khẩu không đúng",
      });
    }
    const response = await UserService.createUser(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const response = await UserService.verifyEmail(token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...newResponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      samesite: "strict",
    });
    return res.status(200).json(newResponse);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refresh_token");
    return res.status(200).json({
      status: "OK",
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The user is required",
      });
    }
    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      status: 'ERROR',
      message: error.message || 'Internal server error'
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    const { newPassword, confirmPassword } = data
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The user is required",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "Xác nhận mật khẩu không đúng",
      });
    }
    const response = await UserService.updatePassword(userId, data);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      status: 'ERROR',
      message: error.message || 'Internal server error'
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The user is required",
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The user is required",
      });
    }
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is required",
      });
    }
    const response = await JwtService.refreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({
      message: error,
    });
  }
};

const getPublicUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra id hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "ERR",
        message: "ID không hợp lệ",
      });
    }

    const user = await User.findById(id).select("_id name avatar");
    if (!user) {
      return res.status(404).json({
        status: "ERR",
        message: "Không tìm thấy user",
      });
    }

    return res.status(200).json({
      status: "OK",
      data: user,
    });
  } catch (error) {
    console.error("Lỗi getPublicUser:", error);
    return res.status(500).json({
      status: "ERR",
      message: "Lỗi server khi lấy thông tin user công khai",
    });
  }
};


// thay đổi trạng thái người dùng
const updateStateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The user is required",
      });
    }
    const response = await UserService.updateStateUser(userId);
    return res.status(200).json(response);
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      status: 'ERROR',
      message: error.message || 'Internal server error'
    });
  }
};

module.exports = {
  createUser,
  verifyEmail,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  refreshToken,
  getPublicUser,
  updatePassword,
  updateStateUser
};
