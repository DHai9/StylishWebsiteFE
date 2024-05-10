/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import { Dashboard } from "../components/admins";
import PropType from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const AdminRoute = ({ isAuth, role, component: Component, ...rest }) => (
  <Routes path="/" element={<Dashboard />}>
    <Route path="/" element={<Dashboard />}/>
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/product/:id" element={<ProductDetail />} />
  </Routes>
);

const mapStateToProps = ({ auth }) => ({
  isAuth: !!auth,
  role: auth?.role || "",
});

export default AdminRoute;
