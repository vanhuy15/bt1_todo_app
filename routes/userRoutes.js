const express = require("express");
const router = express.Router();
const User = require("../models/User");
const genericCrud = require("../controllers/genericController");
const { protect } = require("../middlewares/authMiddleware");
const userCrud = genericCrud(User);

router.route("/").get(protect, userCrud.getAll);
router
  .route("/:id")
  .get(protect, userCrud.getOne)
  .put(protect, userCrud.update)
  .delete(protect, userCrud.delete);

module.exports = router;
