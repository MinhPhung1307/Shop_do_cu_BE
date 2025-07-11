// services/NotificationService.js
const Notification = require("../models/NotificationModel"); // Đảm bảo đường dẫn đúng

const getNotifications = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm tất cả thông báo cho người nhận cụ thể và sắp xếp theo thời gian tạo giảm dần (mới nhất trước)
      const notifications = await Notification.find({
        recipientId: userId,
      }).sort({ createdAt: -1 });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: notifications,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const markAsRead = (notificationId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm và cập nhật thông báo thành đã đọc
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { read: true },
        { new: true } // Trả về tài liệu đã được cập nhật
      );
      if (!notification) {
        resolve({
          status: "ERR",
          message: "Notification not found",
        });
      }
      resolve({
        status: "OK",
        message: "Notification marked as read",
        data: notification,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getNotifications,
  markAsRead,
};
