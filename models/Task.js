const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete"); // Thư viện hỗ trợ Soft Delete (Điểm cộng)

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: { type: Date, required: true },

    // Các khóa ngoại (Relations)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Tích hợp Soft Delete: Sẽ thêm trường 'deleted' (boolean) và 'deletedAt' thay vì xóa thật khỏi DB
taskSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });

module.exports = mongoose.model("Task", taskSchema);
