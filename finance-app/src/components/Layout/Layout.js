// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Common/Navbar';  // Adjust the path as necessary
  // Adjust the path as necessary
// If you have styles for layout

const Layout = ({ username ,userId }) => {
  return (
    <div className="layout">
      <Navbar username={username} userId={userId} />
      <main className="main-content">
        <Outlet />  {/* This will render the matched child route */}
      </main>
    
    </div>
  );
};

export default Layout;