import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = ({ username, userId }) => {
  // to select currency
  const [currency, setCurrency] = useState("USD");

  console.log("UserName", username);
  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <div className="navbar-brand logo">
          <img
            src="/logo.png"
            alt="Budget Bee Logo"
            className="navbar-logo-img"
          />
          <h1 className="logo-title">Budget Bee</h1>
        </div>
        <button
          class="navbar-toggler btn-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#navbarOffcanvasLg"
          aria-controls="navbarOffcanvasLg"
        >
          <i className="fa-solid fa-bars toggler-icon"></i>
        </button>

        <div
          className="offcanvas offcanvas-end offcanvas-show"
          tabindex="-1"
          id="navbarOffcanvasLg"
          aria-labelledby="navbarOffcanvasLgLabel"
        >
          <div className="offcanvas-header offcanvas-navbar">
            <div className="offcanvas-title logo" id="offcanvasNavbarLabel">
              <img
                src="/logo.png"
                alt="Budget Bee Logo"
                className="navbar-logo-img"
              />
              <h1 className="logo-title">Budget Bee</h1>
            </div>
            <i
              className="fa-solid fa-xmark close-icon"
              type="button"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></i>
          </div>
          <ul className="navbar-nav justify-content-lg-end flex-grow-1 pe-3 nav-links">
            <li className="nav-item">
              <NavLink
                to={`/dashboard/${userId}`}
                className="link"
                activeClassName="active-link"
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to={`/budgets/${userId}`}
                className="link"
                activeClassName="active-link"
              >
                Budgets
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to={`/settings/${userId}`}
                className="link"
                activeClassName="active-link"
              >
                Settings
              </NavLink>
            </li>
            <li className="nav-item">
              <div className="currency">
                <label htmlFor="currency"></label>
                <select
                  id="currency"
                  value={currency}
                  onChange={handleCurrencyChange}
                  className="dropdown"
                >
                  <option value="USD" className="dropdown-option">
                    USD
                  </option>
                  <option value="EUR" className="dropdown-option">
                    EUR
                  </option>
                  <option value="THB" className="dropdown-option">
                    THB
                  </option>
                </select>
              </div>
            </li>
            <li className="nav-item">
              <div className="profile">
                <button className="navbar-profile-btn">
                  <i className="fas fa-user-circle profile-icon"></i>
                  <NavLink to={`/profile/${userId}`} className="profile-link">
                    {username}
                  </NavLink>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
