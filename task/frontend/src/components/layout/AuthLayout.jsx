const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="container-fluid g-0">
      <div className="row g-0 min-vh-100">

        <div className="col-lg-6 d-none d-lg-flex auth-sidebar text-white p-5 flex-column justify-content-center">
          <div className="auth-sidebar-content">

            <div className="navbar-brand-icon mb-4">
              <i className="bi bi-check2-square fs-4"></i>
            </div>

            <h1 className="display-5 fw-bold mb-3 lh-sm">
              Organize Your
              <br />
              Work Effortlessly
            </h1>

            <p className="lead opacity-75 mb-5">
              Manage tasks, track deadlines, and boost productivity with
              TaskFlow — your personal task management companion.
            </p>

            <div className="d-flex gap-5">
              {[
                { num: "100%", label: "Secure" },
                { num: "Fast", label: "Performance" },
                { num: "Easy", label: "To Use" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="fs-4 fw-bold mb-0">
                    {item.num}
                  </p>

                  <small className="opacity-75">
                    {item.label}
                  </small>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 bg-light">

          <div
            className="w-100 animate-fade-in"
            style={{ maxWidth: "420px" }}
          >

            <div className="card auth-card border-0">
              <div className="card-body p-4 p-md-5">

                <div className="mb-4">
                  <h2 className="fw-bold mb-1">
                    {title}
                  </h2>

                  <p className="text-muted mb-0 small">
                    {subtitle}
                  </p>
                </div>

                {children}

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AuthLayout;