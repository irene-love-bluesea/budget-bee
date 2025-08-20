// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import "./Login.css"; // Make sure to create this CSS file

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://finance-87242397968.us-central1.run.app/login",
        {
          // Replace with your login API URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );
      if (response.ok) {
        const data = await response.json();
        // Store user data in localStorage or context here
        localStorage.setItem("userId", data.user.id); // Store user ID in localStorage
        localStorage.setItem("userName", data.user.name);
        // Navigate to the income page, passing the user ID in the URL
        navigate(`/dashboard/${data.user.id}`, {
          state: { userId: data.user.id },
        }); // Pass user ID as state
      } else {
        const data = await response.json();
        setError("Login Failed! " + data.message);
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const color = "black";
  return (
    <div className="login-container">
      <div className="col-lg-6 d-none d-lg-flex login-image">
        <img src="/Login.png" alt="Login Visual" />
      </div>
      <div className="col-lg-6 col-md-8 col-sm-12 login-form">
        <div className="logo-section logo-login">
          <img src="/logo.png" alt="Logo" className="logo-pic" />
          <h1 className="logohead">Budget Bee</h1>
        </div>
        <h1 style={{ color }}>{isLoading ? "Logging in..." : "Login"}</h1>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Display error message */}
        <form className="login-flex-form" onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="email" className="login-label">
              Enter Your Email Address
            </label>
            <input
              className="login-input"
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              required
              value={user.email}
              onChange={handleInput}
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="password" className="login-label">
              Enter Your Password
            </label>
            <input
              className="login-input"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              value={user.password}
              onChange={handleInput}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="login-submit">
              Log In
            </button>
          </div>
        </form>
        <div>
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
