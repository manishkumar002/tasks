import { useState, useEffect } from "react";

const TaskForm = ({ initialData, onSubmit, loading, onCancel }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    dueDate: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "Pending",
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setForm({ title: "", description: "", status: "Pending", dueDate: "" });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.dueDate) newErrors.dueDate = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label fw-medium">Title</label>
        <input
          type="text"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter task title"
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label fw-medium">Description</label>
        <textarea
          className="form-control"
          rows={3}
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add a description (optional)"
        />
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6">
          <label className="form-label fw-medium">Status</label>
          <select className="form-select" name="status" value={form.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="col-sm-6">
          <label className="form-label fw-medium">Due Date</label>
          <input
            type="date"
            className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
          {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
        </div>
      </div>

      <div className="d-flex gap-2 justify-content-end">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-brand" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
