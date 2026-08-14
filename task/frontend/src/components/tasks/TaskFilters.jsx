import { STATUS_OPTIONS } from "../../utils/constants";

const TaskFilters = ({ filters, onChange }) => {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-8">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search tasks..."
          />
        </div>
      </div>
      <div className="col-md-4">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-funnel"></i>
          </span>
          <select className="form-select" name="status" value={filters.status} onChange={handleChange}>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
