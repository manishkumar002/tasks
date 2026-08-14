import { Link, useNavigate } from "react-router-dom";
import { getInitials } from "../../utils/constants";
import { clearAuth, getUser } from "../../utils/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-md app-navbar sticky-top">
      <div className="container">
        <Link to="/dashboard" className="navbar-brand d-flex align-items-center gap-2 fw-bold">
          <span className="navbar-brand-icon">
            <i className="bi bi-check2-square"></i>
          </span>
          <span className="d-none d-sm-inline gradient-text">TaskFlow</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-md-center gap-md-3">
            <li className="nav-item d-none d-md-block">
              <div className="d-flex align-items-center gap-2 ps-md-3 border-start">
                <span className="user-avatar">{getInitials(user?.name)}</span>
                <div>
                  <p className="mb-0 small fw-semibold">{user?.name}</p>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.7rem" }}>
                    {user?.email}
                  </p>
                </div>
              </div>
            </li>
            <li className="nav-item d-md-none">
              <div className="d-flex align-items-center gap-2 p-2 bg-light rounded-3 mb-2">
                <span className="user-avatar">{getInitials(user?.name)}</span>
                <div>
                  <p className="mb-0 small fw-semibold">{user?.name}</p>
                  <p className="mb-0 text-muted" style={{ fontSize: "0.7rem" }}>
                    {user?.email}
                  </p>
                </div>
              </div>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
