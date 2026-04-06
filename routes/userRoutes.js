const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middlewares/authMiddleware");

// lấy tất cả danh sách User
router.get("/", protect, async (req, res) => {
  try {
    // Tìm tất cả user chưa bị xóa. .select('-password') để ẩn mật khẩu đi cho bảo mật
    const users = await User.find({ deleted: false }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách", error: error.message });
  }
});

// lấy chi tiết 1 User
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      deleted: false,
    }).select("-password");
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Cập nhật User
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username: req.body.username },
      { returnDocument: "after" }, // Đã fix luôn cảnh báo Mongoose cho bạn
    ).select("-password");
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
  }
});

// xóa User
router.delete("/:id", protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { deleted: true });
    res.status(200).json({ message: "Đã xóa tài khoản thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi xóa tài khoản", error: error.message });
  }
});

module.exports = router;
