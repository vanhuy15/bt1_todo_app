const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const genericCrud = require("../controllers/genericController");
const { protect } = require("../middlewares/authMiddleware");

const commentController = genericCrud(Comment);

router
  .route("/")
  .post(protect, commentController.create)
  .get(protect, commentController.getAll);

router
  .route("/:id")
  .get(protect, commentController.getOne)
  .put(protect, commentController.update)
  .delete(protect, commentController.delete);

module.exports = router;
