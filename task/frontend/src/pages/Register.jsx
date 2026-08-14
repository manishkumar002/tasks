import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthLayout from "../components/layout/AuthLayout";
import api from "../api/api";
import { isAuthenticated } from "../utils/auth";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (form.password !== form.confirmPassword) {
      setErrors({
        confirmPassword: "Passwords do not match",
      });
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      const res = err.response?.data;

      if (res?.errors) {
        setErrors(res.errors);
      } else {
        toast.error(res?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up to start managing your tasks"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-medium">Full Name</label>

          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-person"></i>
            </span>

            <input
              type="text"
              className={`form-control ${
                errors.name ? "is-invalid" : ""
              }`}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
            />

            {errors.name && (
              <div className="invalid-feedback">
                {errors.name}
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium">Email</label>

          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-envelope"></i>
            </span>

            <input
              type="email"
              className={`form-control ${
                errors.email ? "is-invalid" : ""
              }`}
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />

            {errors.email && (
              <div className="invalid-feedback">
                {errors.email}
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium">Password</label>

          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-lock"></i>
            </span>

            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${
                errors.password ? "is-invalid" : ""
              }`}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
            />

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i
                className={`bi ${
                  showPassword ? "bi-eye-slash" : "bi-eye"
                }`}
              ></i>
            </button>

            {errors.password && (
              <div className="invalid-feedback d-block">
                {errors.password}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-medium">
            Confirm Password
          </label>

          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-lock-fill"></i>
            </span>

            <input
              type="password"
              className={`form-control ${
                errors.confirmPassword ? "is-invalid" : ""
              }`}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
            />

            {errors.confirmPassword && (
              <div className="invalid-feedback">
                {errors.confirmPassword}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-brand w-100 btn-lg"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-muted mt-4 mb-0 small">
        Already have an account?{" "}
        <Link to="/login" className="link-brand">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
