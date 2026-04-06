const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const genericCrud = require("../controllers/genericController");
const { protect } = require("../middlewares/authMiddleware");

const categoryController = genericCrud(Category);

router
  .route("/")
  .post(protect, categoryController.create)
  .get(protect, categoryController.getAll);

router
  .route("/:id")
  .get(protect, categoryController.getOne)
  .put(protect, categoryController.update)
  .delete(protect, categoryController.delete);

module.exports = router;
