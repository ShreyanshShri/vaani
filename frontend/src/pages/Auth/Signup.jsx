import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import "./auth.css";

function Signup() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        fullname: form.fullname,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to create account right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="auth-header">
          <h1>Vaani</h1>
          <p>Create your account</p>
          <h2>Join the journey</h2>
          <span>Start tracking your health with us</span>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <div className="input-wrapper">
            <User size={18} />
            <input
              type="text"
              placeholder="Your name"
              value={form.fullname}
              onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            />
          </div>

          <label>Username</label>
          <div className="input-wrapper">
            <User size={18} />
            <input
              type="text"
              placeholder="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <label>Email</label>
          <div className="input-wrapper">
            <Mail size={18} />
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <label>Password</label>
          <div className="input-wrapper">
            <Lock size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="icon-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error ? (
            <p style={{ color: "#b91c1c", marginBottom: "12px" }}>{error}</p>
          ) : null}

          <button className="login-button" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="signup-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
