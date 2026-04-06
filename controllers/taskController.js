const Task = require("../models/Task");
const TaskHistory = require("../models/TaskHistory");
const mongoose = require("mongoose");

// Xử lý Lọc, Tìm kiếm, Sắp xếp (Các câu truy vấn từ 1 đến 8)
const getTasksAdvanced = async (req, res) => {
  try {
    const { priority, status, keyword, isOverdue, categoryName, sortBy } =
      req.query;
    let query = { createdBy: req.user._id };

    if (priority) query.priority = priority;
    if (status === "incomplete") query.status = { $ne: "completed" };
    else if (status) query.status = status;

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    if (isOverdue === "true") {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: "completed" };
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === "dueDate") sortOption = { dueDate: 1 };

    let tasks = await Task.find(query)
      .populate("category", "name")
      .sort(sortOption);

    if (categoryName) {
      tasks = tasks.filter(
        (t) => t.category && t.category.name === categoryName,
      );
    }

    res.status(200).json({ count: tasks.length, data: tasks });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách task", error: error.message });
  }
};

// 9. Thống kê số task theo trạng thái
const getStatsByStatus = async (req, res) => {
  try {
    const statusStats = await Task.aggregate([
      { $match: { createdBy: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.status(200).json(statusStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 10. Tìm top 3 category có nhiều task nhất
const getTopCategories = async (req, res) => {
  try {
    const topCategories = await Task.aggregate([
      { $match: { createdBy: req.user._id } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "catInfo",
        },
      },
      { $unwind: "$catInfo" },
      { $project: { categoryName: "$catInfo.name", count: 1 } },
    ]);
    res.status(200).json(topCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 11. Tính tỷ lệ hoàn thành task của từng user
const getCompletionRate = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments({ createdBy: req.user._id });
    const completedTasks = await Task.countDocuments({
      createdBy: req.user._id,
      status: "completed",
    });
    const completionRate =
      totalTasks === 0
        ? 0
        : ((completedTasks / totalTasks) * 100).toFixed(2) + "%";
    res.status(200).json({ totalTasks, completedTasks, completionRate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 12. Tìm task được tạo nhiều nhất theo từng tháng
const getTasksByMonth = async (req, res) => {
  try {
    const tasksByMonth = await Task.aggregate([
      { $match: { createdBy: req.user._id } },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).json(tasksByMonth);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 13. Tìm các task hoàn thành sau deadline
const getCompletedLateTasks = async (req, res) => {
  try {
    const completedLateTasks = await Task.aggregate([
      { $match: { createdBy: req.user._id, status: "completed" } },
      { $match: { $expr: { $gt: ["$updatedAt", "$dueDate"] } } },
    ]);
    res.status(200).json(completedLateTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 14. Tính thời gian trung bình hoàn thành một task
const getAvgCompletionTime = async (req, res) => {
  try {
    const avgCompletionTime = await Task.aggregate([
      { $match: { createdBy: req.user._id, status: "completed" } },
      {
        $group: {
          _id: null,
          avgTimeMillis: { $avg: { $subtract: ["$updatedAt", "$createdAt"] } },
        },
      },
      {
        $project: {
          _id: 0,
          avgHours: { $divide: ["$avgTimeMillis", 1000 * 60 * 60] },
        },
      },
    ]);
    res.status(200).json(avgCompletionTime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [MỚI] Hàm cập nhật Task viết tay để đảm bảo ghi được lịch sử
const updateTask = async (req, res) => {
  try {
    // Tìm task cũ để lấy dữ liệu trước khi sửa
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!task) return res.status(404).json({ message: "Không tìm thấy task" });

    const previousState = task.toObject();

    // Cập nhật task mới
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // Ghi vào collection TaskHistory
    await TaskHistory.create({
      task: updatedTask._id,
      modifiedBy: req.user._id,
      actionDescription: "Cập nhật thông tin/trạng thái Task",
      previousState: previousState,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
  }
};

module.exports = {
  getTasksAdvanced,
  getStatsByStatus,
  getTopCategories,
  getCompletionRate,
  getTasksByMonth,
  getCompletedLateTasks,
  getAvgCompletionTime,
  updateTask,
};
