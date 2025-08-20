import React from "react";
import "./NavHome.css"; // Import the CSS file

const NavHome = () => {
    return (
        <nav className="navbarhome">
            {/* Logo */}
            <div className="logo">
                <div><img src="/logo.png" alt="Logo" className="logo-img" /></div>
                <div><h1 className="logo-title">Budget Bee</h1></div>
            </div>

            <div className="main-navhome">
                {/* Buttons */}
                <a href="/login" className="nav-button login">
                    Login
                </a>
                <a href="/signup" className="nav-button signup">
                    Sign Up
                </a>
            </div>
        </nav>
    );
};

export default NavHome;