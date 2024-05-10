import React, { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthorServices } from "../../app/store/features";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(goToNextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [currentSlide]);

  const goToNextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const onFinish = (values) => {
    setLoading(true); // Simulating loading state
    // Here you can handle login logic, like making API requests
    setTimeout(() => {
      setLoading(false); // Simulating end of loading state
    }, 2000); // Simulating API call delay

    dispatch(AuthorServices.signin(values))
      .unwrap()
      .then((res) => {
        if (res.StatusCode === 200) {
          message.success({
            content: "Login success",
            duration: 2,
          });
          navigate("/");
          window.location.reload();
        } else {
          message.error({
            content: "Login faild: " + res.Message,
            duration: 2,
            style: {
              marginTop: "3vh",
            },
          });
        }
      })
      .catch((e) => {
        message.error({
          content: "Login faild",
          duration: 2,
          style: {
            marginTop: "3vh",
          },
        });
      });
  };

  const slides = [
    {
      imageUrl:
        "https://cdn.sforum.vn/sforum/wp-content/uploads/2023/12/lich-chieu-phim-dau-pha-thuong-khung-phan-5-anh-1.jpg",
      alt: "Image 1",
      caption: "Slide 1",
    },
    {
      imageUrl:
        "https://cdn.sforum.vn/sforum/wp-content/uploads/2023/12/lich-chieu-phim-dau-pha-thuong-khung-phan-5-anh-3.jpg",
      alt: "Image 2",
      caption: "Slide 2",
    },
  ];

  return (
    <div className="container my-5">
      <div className="row shadow-lg rounded ">
        <div className="col-9 slideshow container shadow-lg">
          <div className="slide">
            <img
              width={"100%"}
              src={slides[currentSlide].imageUrl}
              alt={slides[currentSlide].alt}
            />
          </div>
        </div>
        <Form
          name="normal_login"
          className="login-form my-5 p-5 col-3"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="UserName"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="User Name"
            />
          </Form.Item>
          <Form.Item
            initialValue={"Pupubug123@"}
            name="Password"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              value={"Pupubug123@"}
              defaultValue={"Pupubug123@"}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a className="login-form-forgot" href="/">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
            >
              Log in
            </Button>
            Or <a href="/">register now!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
