const { validationResult } = require("express-validator");
const Task = require("../models/Task");
const ErrorHandler = require("../utils/errorHandler");

const formatValidationErrors = (req) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return null;

  const formatted = {};
  errors.array().forEach((err) => {
    if (!formatted[err.path]) formatted[err.path] = err.msg;
  });
  return formatted;
};

exports.getTasks = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 6));
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };

    if (req.query.status && ["Pending", "Completed"].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    if (req.query.search?.trim()) {
      const searchRegex = new RegExp(req.query.search.trim(), "i");
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({ dueDate: 1, createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);

    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskStats = {
      total: 0,
      pending: 0,
      completed: 0,
    };

    stats.forEach((item) => {
      taskStats.total += item.count;
      if (item._id === "Pending") taskStats.pending = item.count;
      if (item._id === "Completed") taskStats.completed = item.count;
    });

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      stats: taskStats,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return next(new ErrorHandler("Task not found.", 404));
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const validationErrors = formatValidationErrors(req);
    if (validationErrors) {
      return res.status(422).json({ success: false, errors: validationErrors });
    }

    const task = await Task.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const validationErrors = formatValidationErrors(req);
    if (validationErrors) {
      return res.status(422).json({ success: false, errors: validationErrors });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true },
    );

    if (!task) {
      return next(new ErrorHandler("Task not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return next(new ErrorHandler("Task not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return next(new ErrorHandler("Task not found.", 404));
    }

    task.status = task.status === "Pending" ? "Completed" : "Pending";
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task status updated",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
