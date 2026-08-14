const StatsCards = ({ stats }) => {
  const cards = [
    { label: "Total Tasks", value: stats.total, icon: "bi-list-task", cls: "total" },
    { label: "Pending", value: stats.pending, icon: "bi-clock", cls: "pending" },
    { label: "Completed", value: stats.completed, icon: "bi-check-circle", cls: "completed" },
  ];

  return (
    <div className="row g-3 mb-4">
      {cards.map((card) => (
        <div key={card.label} className="col-12 col-sm-4">
          <div className="card stat-card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className={`stat-icon ${card.cls}`}>
                <i className={`bi ${card.icon}`}></i>
              </div>
              <div>
                <h3 className="fw-bold mb-0">{card.value}</h3>
                <small className="text-muted fw-medium">{card.label}</small>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
