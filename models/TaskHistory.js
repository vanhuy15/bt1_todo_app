const mongoose = require("mongoose");

const taskHistorySchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actionDescription: { type: String, required: true },
    previousState: { type: Object },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

module.exports = mongoose.model("TaskHistory", taskHistorySchema);
