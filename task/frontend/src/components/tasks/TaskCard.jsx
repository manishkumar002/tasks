import { formatDate, isOverdue } from "../../utils/constants";

const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  const overdue = isOverdue(task.dueDate, task.status);
  const isCompleted = task.status === "Completed";
  const cardClass = isCompleted ? "completed" : overdue ? "overdue" : "";

  return (
    <div className={`card task-card h-100 ${cardClass}`}>
      <div className="card-body">
        <div className="d-flex align-items-start gap-2">
          <button
            type="button"
            className="btn btn-link p-0 "
            onClick={() => onToggle(task._id)}
            aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
          >
            <i
              className={`bi fs-5 ${isCompleted ? "bi-check-circle-fill text-success" : "bi-circle text-secondary"}`}
            ></i>
          </button>

          <div className="flex-grow-1 min-w-0">
            <div className="d-flex justify-content-between align-items-start gap-2">
              <h6 className={`fw-semibold mb-1 ${isCompleted ? "text-muted" : ""}`}>
                {task.title}
              </h6>
              <span className={`badge ${isCompleted ? "badge-completed" : "badge-pending"} flex-shrink-0`}>
                {task.status}
              </span>
            </div>

            {task.description && (
              <p className={`small mb-2 ${isCompleted ? "text-muted" : "text-secondary"}`}>
                {task.description}
              </p>
            )}

            <small className={overdue ? "text-danger fw-medium" : "text-muted"}>
              <i className={`bi me-1 ${overdue ? "bi-exclamation-circle" : "bi-calendar3"}`}></i>
              {overdue ? "Overdue: " : "Due: "}
              {formatDate(task.dueDate)}
            </small>
          </div>
        </div>

        <div className="d-flex gap-2 mt-3 pt-3 border-top">
          <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(task)}>
            <i className="bi bi-pencil me-1"></i>
            Edit
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(task._id)}>
            <i className="bi bi-trash me-1"></i>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
