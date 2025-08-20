// src/components/Common/Footer.js
import React from 'react';
import './Footer.css'; // Ensure this path is correct

const Footer = () => {
  return (
    <footer className="footer">
      <div className='row footer-section'>
      <div className="col-lg-4 col-md-4 col-sm-12 logo-section-foot logo-footer text-center">
        <img src="/logo.png" alt="Logo" className="logo-img" />
        <h1 className='footer-h'>Budget Bee</h1>
      </div>
      <div className="col-lg-4 col-md-8 col-sm-12 contact-section text-center">
        <h2 className='footer-head'>Contact Us</h2>
        <p><i className="fa-solid fa-envelope" style={{ color: 'white', fontSize: '24px',marginRight:'10px' }}></i>budgetbee@hotmail.com, budgetbeeservices@gmail.com</p>
        <p><i className="fa-solid fa-phone" style={{ color: 'white', fontSize: '24px',marginRight:'10px'  }}></i>+66-7639880114, +66-392845618, +66-274917375</p>
        <p><i className="fa-solid fa-building" style={{ color: 'white', fontSize: '24px',marginRight:'10px'  }}></i>333, Moo1, Thasud, Mueang Chiang Rai District, Thailand, 57100</p>
      </div>
      <div className="col-lg-4 col-md-12 col-sm-12 social-section text-center">
        <h2 className='footer-head'>Follow Us</h2>
        <div className="social-icons">
        <i className="fa-brands fa-twitter-square" style={{ color: 'white', fontSize: '40px' }}></i>
        <i className="fa-brands fa-instagram-square" style={{ color: 'white', fontSize: '40px' }}></i>
        <i className="fa-brands fa-facebook-square" style={{ color: 'white', fontSize: '40px' }}></i>
        <i className="fa-brands fa-linkedin" style={{ color: 'white', fontSize: '40px' }}></i>
        </div>
        <div className='links'><a href='/'>Cookie Policy</a>
        <a href='/'>Privacy Policy</a></div>
      </div>
      </div>
      <div className='footer-text'>
        <p>"The first step to wealth is learning how to manage what you have." <i className="fa-solid fa-copyright" style={{ color: 'white', fontSize: '16px',paddingRight:'5px' }}> </i>CopyRight 2024 BudgetBee.com. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;