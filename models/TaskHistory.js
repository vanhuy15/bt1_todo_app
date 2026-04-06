const mongoose = require("mongoose");

const taskHistorySchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Lưu lại những trường nào bị thay đổi (VD: "status changed from pending to completed")
    actionDescription: { type: String, required: true },
    previousState: { type: Object }, // Có thể lưu lại cục JSON của task trước khi sửa
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Chỉ cần thời gian tạo lịch sử
  },
);

module.exports = mongoose.model("TaskHistory", taskHistorySchema);
