import React from "react";
import logo from "../../public/images/logo.png";
import { FacebookOutlined, InstagramOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
const Footer = () => {
  return (
    <footer>
      <div className="container shadow-lg mt-5">
        <div className="footer-content row">
          <div className="footer-logo col-md-3">
            <img src={logo} alt="Logo" />
          </div>
          <div className="contact-info col-md-9 row">
            <div className="contact-info col-md-4">
              <h3>Contact Us</h3>
              <p><FacebookOutlined />  123 Main Street</p>
              <p><InstagramOutlined /> City, State, Zip Code</p>
              <p><MailOutlined /> example@example.com</p>
              <p><PhoneOutlined /> 123-456-7890</p>
            </div>
            <div className="contact-info col-md-4">
              <h3>Contact Us</h3>
              <p>123 Main Street</p>
              <p>City, State, Zip Code</p>
              <p>Email: example@example.com</p>
              <p>Phone: 123-456-7890</p>
            </div>
            <div className="contact-info col-md-4">
              <h3>Contact Us</h3>
              <p>123 Main Street</p>
              <p>City, State, Zip Code</p>
              <p>Email: example@example.com</p>
              <p>Phone: 123-456-7890</p>
            </div>
          </div>
        </div>
        <div>
          <p className="copyright">
            &copy; 2024 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
