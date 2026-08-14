import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TaskLayout from "../components/layout/TaskLayout";
import StatsCards from "../components/tasks/StatsCards";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskCard from "../components/tasks/TaskCard";
import TaskPagination from "../components/tasks/TaskPagination";
import TaskForm from "../components/tasks/TaskForm";
import Modal from "../components/Modal";
import api from "../api/api";
import { clearAuth, getUser } from "../utils/auth";
import { PAGE_SIZE } from "../utils/constants";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ search: "", status: "", page: 1 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleAuthError = useCallback(
    (err) => {
      if (err.response?.status === 401) {
        clearAuth();
        toast.error("Session expired. Please login again.");
        navigate("/login", { replace: true });
        return true;
      }
      return false;
    },
    [navigate],
  );

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/tasks", {
        params: {
          page: filters.page,
          limit: PAGE_SIZE,
          status: filters.status || undefined,
          search: filters.search || undefined,
        },
      });
      setTasks(data.data);
      setPagination(data.pagination);
      setStats(data.stats);
    } catch (err) {
      if (!handleAuthError(err)) {
        toast.error(err.response?.data?.message || "Failed to load tasks");
      }
    } finally {
      setLoading(false);
    }
  }, [filters, handleAuthError]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (formData) => {
    setActionLoading(true);
    try {
      await api.post("/tasks", formData);
      toast.success("Task created!");
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      if (!handleAuthError(err)) {
        toast.error(err.response?.data?.message || "Failed to create task");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    setActionLoading(true);
    try {
      await api.put(`/tasks/${editingTask._id}`, formData);
      toast.success("Task updated!");
      setModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      if (!handleAuthError(err)) {
        toast.error(err.response?.data?.message || "Failed to update task");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted!");
      setDeleteConfirm(null);
      fetchTasks();
    } catch (err) {
      if (!handleAuthError(err)) {
        toast.error(err.response?.data?.message || "Failed to delete task");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.patch(`/tasks/${id}/toggle`);
      fetchTasks();
    } catch (err) {
      if (!handleAuthError(err)) {
        toast.error(err.response?.data?.message || "Failed to update status");
      }
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <TaskLayout>
      <div className="page-header mb-4 animate-fade-in">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <p className="text-muted small mb-1 fw-medium">
              <i className="bi bi-sun me-1"></i>
              Good day, {firstName}
            </p>
            <h2 className="fw-bold mb-1 gradient-text">My Tasks</h2>
            <p className="text-muted mb-0">
              Manage and track all your tasks in one place
            </p>
          </div>
          <button className="btn btn-brand btn-brand-lg flex-shrink-0" onClick={openCreateModal}>
            <i className="bi bi-plus-lg me-2"></i>
            Add New Task
          </button>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="card task-panel border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
          <div className="d-flex align-items-center gap-2 mb-1">
            <i className="bi bi-kanban text-primary"></i>
            <h5 className="fw-semibold mb-0">Task Board</h5>
          </div>
          <p className="text-muted small mb-0">
            {pagination.total} task{pagination.total !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="card-body p-4">
          <TaskFilters filters={filters} onChange={setFilters} />

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted small mt-3 mb-0">Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-5 animate-fade-in">
              <div className="empty-icon-wrap mb-3">
                <i className="bi bi-clipboard-check"></i>
              </div>
              <h5 className="fw-semibold">No tasks found</h5>
              <p className="text-muted small">
                {filters.search || filters.status
                  ? "Try adjusting your filters"
                  : "Create your first task to get started"}
              </p>
              {!filters.search && !filters.status && (
                <button className="btn btn-brand" onClick={openCreateModal}>
                  <i className="bi bi-plus-lg me-1"></i>
                  Create Task
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="row g-3">
                {tasks.map((task) => (
                  <div key={task._id} className="col-12 col-md-6 col-xl-4">
                    <TaskCard
                      task={task}
                      onEdit={openEditModal}
                      onDelete={setDeleteConfirm}
                      onToggle={handleToggle}
                    />
                  </div>
                ))}
              </div>
              <TaskPagination
                pagination={pagination}
                onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
              />
            </>
          )}
        </div>
      </div>

      <Modal
        show={modalOpen}
        onClose={closeModal}
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <TaskForm
          initialData={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          loading={actionLoading}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        show={!!deleteConfirm}
        onClose={() => !actionLoading && setDeleteConfirm(null)}
        title="Delete Task"
        size="sm"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setDeleteConfirm(null)}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              disabled={actionLoading}
              onClick={() => handleDelete(deleteConfirm)}
            >
              {actionLoading ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        <div className="text-center py-2">
          <div className="empty-icon-wrap mb-3" style={{ width: 56, height: 56, fontSize: "1.5rem" }}>
            <i className="bi bi-trash text-danger"></i>
          </div>
          <p className="text-muted small mb-0">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </TaskLayout>
  );
};

export default Dashboard;
