import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import {toast} from "sonner";
import { useAuthStore } from "../../stores/useAuthStore";
import "./signup.css";
import { Link } from "react-router-dom";

export default function Signup() {
  const { isSigningUp, signup } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFormValues = () => {
    if (!formData.fullName.trim()) return toast.error("Full Name is required");
    if (!formData.email) return toast.error("Email is required");
    if (!formData.password) return toast.error("Password is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters long");
    return true;
  };

  const handleSubmit = async () => {
    const valid = validateFormValues();
    if (valid === true) {
      signup(formData);
    }
  };

  const FloatingOrb = ({ className, delay = 0 }) => (
    <div
      className={`floating-orb ${className}`}
      style={{
        animationDelay: `${delay}s`,
      }}
    />
  );

  return (
    <div className="signup-page">
      <FloatingOrb className="orb orb-1" delay={0} />
      <FloatingOrb className="orb orb-2" delay={2} />
      <FloatingOrb className="orb orb-3" delay={4} />
      <div className="grid-pattern" />

      <div className="form-container">
        <div className="form-header">
          <h1>Register yourself</h1>
          <p>Create your account and start using  Real Time Collaborative To-Do Board</p>
        </div>

        <div className="form-box">
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User className={`icon ${focusedField === "fullName" ? "active" : ""}`} />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                autoComplete="off"
                onChange={handleInputChange}
                onFocus={() => setFocusedField("fullName")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className={`icon ${focusedField === "email" ? "active" : ""}`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                autoComplete="off"
                onChange={handleInputChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className={`icon ${focusedField === "password" ? "active" : ""}`} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-visibility"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <div className="loading">
                <div className="spinner" />
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="footer-text">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
