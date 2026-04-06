const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem header có chứa token theo chuẩn Bearer không
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Tách lấy chuỗi token
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token bằng chữ ký bí mật
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user trong DB và gắn vào req (loại bỏ trường password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Chuyển tiếp sang xử lý API
    } catch (error) {
      res
        .status(401)
        .json({ message: "Không có quyền truy cập, token không hợp lệ" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ message: "Không có quyền truy cập, không tìm thấy token" });
  }
};

module.exports = { protect };
