const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Sẽ được hash bằng bcryptjs
  },
  {
    timestamps: true, // Tự động sinh createdAt và updatedAt
  },
);

module.exports = mongoose.model("User", userSchema);
