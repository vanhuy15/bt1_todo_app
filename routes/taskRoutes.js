const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const genericCrud = require("../controllers/genericController");
const { protect } = require("../middlewares/authMiddleware");

const {
  getTasksAdvanced,
  getStatsByStatus,
  getTopCategories,
  getCompletionRate,
  getTasksByMonth,
  getCompletedLateTasks,
  getAvgCompletionTime,
  updateTask, // <-- Import hàm này
} = require("../controllers/taskController");

const taskCrud = genericCrud(Task);

router.get("/stats/status", protect, getStatsByStatus);
router.get("/stats/top-categories", protect, getTopCategories);
router.get("/stats/completion-rate", protect, getCompletionRate);
router.get("/stats/by-month", protect, getTasksByMonth);
router.get("/stats/late-completed", protect, getCompletedLateTasks);
router.get("/stats/avg-time", protect, getAvgCompletionTime);

// API TÌM KIẾM & LỌC CHUNG
router.route("/").get(protect, getTasksAdvanced).post(protect, taskCrud.create);

// API CRUD CƠ BẢN
router
  .route("/:id")
  .get(protect, taskCrud.getOne)
  .put(protect, updateTask)
  .delete(protect, taskCrud.delete);

module.exports = router;
