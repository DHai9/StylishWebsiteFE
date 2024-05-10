import React from "react";
import { Link } from "react-router-dom";
import ProductList from "../commons/products/product-list";

const Home = () => {
  return (
    <div className="container mt-5 shadow-lg">
      <div className="row">
        <div className="col-md-1">
          <ul className="list-group">
            <li className="list-group-item list-group-item-action">
              <Link to="/" className="nav-link">
                Trang Chủ
              </Link>
            </li>
            <li className="list-group-item list-group-item-action">
              <Link to="/about" className="nav-link">
                Thông Tin
              </Link>
            </li>
            <li className="list-group-item list-group-item-action">
              <Link to="/contact" className="nav-link">
                Liên Hệ
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-11">
          <div className="text-center display-4 mb-5">
            <p>
              <strong>
                <b>Hot Trend</b>
              </strong>
            </p>
            <ProductList />
          </div>
          <div className="text-center display-4 mb-5">
            <p>
              <strong>
                <b>Phổ Biến</b>
              </strong>
            </p>
            <ProductList />
          </div>
          <div className="text-center display-4 mb-5">
            <p>
              <strong>
                <b>Đang Giảm Giá</b>
              </strong>
            </p>
            <ProductList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
