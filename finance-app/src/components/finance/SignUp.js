// src/components/SignUp.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css"; // New CSS file for Sign-Up

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    retypePassword: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
    if (name === "retypePassword" && value !== user.password) {
      setError("Passwords do not match!");
    } else {
      setError(null); // Clear the error if they match
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user.password !== user.retypePassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        "https://finance-87242397968.us-central1.run.app/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            password: user.password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userName", data.name);
        navigate(`/dashboard/${data.id}`, { state: { userId: data.id } }); // Redirect to login page
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Signup failed! Please try again.");
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="col-lg-6 col-md-8 col-sm-12 signup-form">
        <div className="logo-section logo-signup">
          <img src="/logo.png" alt="Logo" className="logo-pic" />
          <h1 className="signup-logo">Budget Bee</h1>
        </div>
        <h1>{isLoading ? "Signing up..." : "Sign Up"}</h1>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Display error message */}
        <form className="signup-flex-form" onSubmit={handleSubmit}>
          <div className="form-group form-signup">
            <label htmlFor="name" className="signup-label">
              Enter Your Name
            </label>
            <input
              className="signup-input"
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              required
              value={user.name}
              onChange={handleInput}
            />
          </div>
          <div className="form-group form-signup">
            <label htmlFor="email" className="signup-label">
              Enter Your Email Address
            </label>
            <input
              className="signup-input"
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              required
              value={user.email}
              onChange={handleInput}
            />
          </div>
          <div className="form-group form-signup">
            <label htmlFor="password" className="signup-label">
              Enter Your Password
            </label>
            <input
              className="signup-input"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              value={user.password}
              onChange={handleInput}
            />
          </div>
          <div className="form-group form-signup">
            <label htmlFor="retype-password" className="signup-label">
              Confirm Your Password
            </label>
            <input
              className="signup-input"
              type="password"
              id="retype-password"
              name="retypePassword"
              placeholder="Confirm Password"
              required
              value={user.retypePassword}
              onChange={handleInput}
            />
            {error && user.retypePassword && (
              <p className="error-message">{error}</p>
            )}{" "}
            {/* Display error message for password mismatch */}
          </div>
          <div className="form-actions">
            <button type="submit" className="signup-submit">
              Sign Up
            </button>
          </div>
        </form>
        <p>
          Already have an account? <a href="/login">Log in</a>
        </p>
        <div></div>
      </div>
      <div className="col-lg-6 d-none d-lg-flex signup-image">
        <img src="/SignUp.png" alt="Sign Up Visual" />
      </div>
    </div>
  );
};

export default SignUp;
