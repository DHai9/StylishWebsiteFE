import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  ShoppingOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  ContactsOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Dropdown,
  Space,
  Menu,
  message,
  Affix,
} from "antd";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthorServices, CartServices } from "../../app/store/features";
import slide1 from "../../public/data-asset/slide1.jpg";
import slide2 from "../../public/data-asset/slide2.jpg";
import slide3 from "../../public/data-asset/slide3.jpg";
import slide4 from "../../public/data-asset/slide4.jpg";
import slide5 from "../../public/data-asset/slide5.jpg";
const slides = [
  {
    imageUrl: slide1,
    alt: "Image 1",
    caption: "Slide 1",
  },
  {
    imageUrl: slide2,
    alt: "Image 2",
    caption: "Slide 2",
  },
  {
    imageUrl: slide3,
    alt: "Image 3",
    caption: "Slide 3",
  },
  {
    imageUrl: slide4,
    alt: "Image 4",
    caption: "Slide 4",
  },
  {
    imageUrl: slide5,
    alt: "Image 5",
    caption: "Slide 5",
  },
];

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  const cart = useSelector((state) => state.cartReducer.cart);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!user) {
      dispatch(AuthorServices.initUserFromLocal());
    }
    if (!cart && user) {
      dispatch(CartServices.getCartByUserId(user.Id));
    }
    const intervalId = setInterval(goToNextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [currentSlide, dispatch, user, cart]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const goToNextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const signOut = () => {
    dispatch(AuthorServices.signOut())
      .unwrap()
      .then((res) => {
        if (res) {
          message.success({
            content: "Sign Out success",
            duration: 2,
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          message.error({
            content: "Sign Out faild " + res.Message,
            duration: 2,
            style: {
              marginTop: "3vh",
            },
          });
        }
      })
      .catch((err) => {
        message.error({
          content: err,
          duration: 2,
          style: {
            marginTop: "3vh",
          },
        });
      });
  };

  const user_menu = (
    <Menu>
      {user === null ? (
        <Menu.Item key="3">
          <Link to="/sign-in" className="nav-link">
            <LoginOutlined /> Đăng Nhập
          </Link>
        </Menu.Item>
      ) : (
        <>
          <Menu.Item key="1">
            <UserOutlined /> Tài Khoản
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/order-list" className="nav-link">
              <ShoppingOutlined /> Đơn Hàng
            </Link>
          </Menu.Item>
          <Menu.Item onClick={() => signOut()} key="4">
            <LogoutOutlined /> Đăng Xuất
          </Menu.Item>
        </>
      )}
    </Menu>
  );
  return (
    // Header
    <header className="container">
      <div className="row">
        <Affix offsetTop={5}>
          <nav className="navbar navbar-expand-lg navbar-light shadow-lg bg-nav container">
            <div className="col-2">
              <a className="navbar-brand mx-5" href="/">
                <b>
                  <strong>STYLISH</strong>
                </b>
              </a>
              <button
                className="navbar-toggler"
                type="button"
                onClick={toggleMenu}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
            <div
              className={`col-4 collapse navbar-collapse ${
                isMenuOpen ? "show" : ""
              }`}
            >
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    <HomeOutlined className="mx-2" />
                    Trang Chủ
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link">
                    <InfoCircleOutlined className="mx-2" />
                    Thông Tin
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/contact" className="nav-link">
                    <ContactsOutlined className="mx-2" />
                    Liên Hệ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-2 d-flex">
              <div className="mx-1">
                <Dropdown overlay={user_menu}>
                  <Space>
                    <UserOutlined />
                  </Space>
                </Dropdown>
              </div>
              <div className="mx-1">
                <Link to={"/cart-user"}>
                  <Badge count={cart?.CartDetails?.length} size="small">
                    <ShoppingOutlined />
                  </Badge>
                </Link>
              </div>
            </div>
          </nav>
        </Affix>
        <div className="slideshow container shadow-lg">
          <div className="slide d-flex justify-content-center">
            <img
              width={"100%"}
              src={slides[currentSlide].imageUrl}
              alt={slides[currentSlide].alt}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
