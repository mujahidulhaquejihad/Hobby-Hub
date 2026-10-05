import React from "react";
import { Link } from "react-router-dom";
import logo from '../../images/UniBook.png';

const Footer = () => {
  return (
    <footer className="app_footer">
      <div className="app_footer_inner">
        <Link to="/" className="app_footer_logo">
          <img src={logo} alt="UniBook" className="app_footer_logo_img" />
        </Link>
        <nav className="app_footer_links">
          <Link to="/">Home</Link>
          <Link to="/discover">Discover</Link>
          <Link to="/message">Message</Link>
        </nav>
        <span className="app_footer_copy">© {new Date().getFullYear()} UniBook</span>
      </div>
    </footer>
  );
};

export default Footer;
