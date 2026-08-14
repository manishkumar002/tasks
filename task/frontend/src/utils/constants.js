export const TASK_STATUS = {
  PENDING: "Pending",
  COMPLETED: "Completed",
};

export const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "Completed", label: "Completed" },
];

export const PAGE_SIZE = 6;

export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const isOverdue = (dueDate, status) => {
  if (status === "Completed") return false;
  return new Date(dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
};

export const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
