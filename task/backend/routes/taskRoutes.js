const express = require("express");
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} = require("../controllers/taskController");
const {
  createTaskValidation,
  updateTaskValidation,
} = require("../validators/taskValidator");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", createTaskValidation, createTask);
router.put("/:id", updateTaskValidation, updateTask);
router.patch("/:id/toggle", toggleTaskStatus);
router.delete("/:id", deleteTask);

module.exports = router;
