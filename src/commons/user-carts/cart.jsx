import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, InputNumber, Input, message } from "antd";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import {
  CartServices,
  AuthorServices,
} from "../../app/store/features";
const Cart = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const user = useSelector((state) => state.userReducer.user);
  const cart = useSelector((state) => state.cartReducer.cart);

  useEffect(() => {
    if (!user) {
      dispatch(AuthorServices.initUserFromLocal());
    }
    if (!cart && user !== null) {
      dispatch(CartServices.getCartByUserId(user.Id));
    }
    if (cart) {
      form.resetFields();
    }
  }, [dispatch, cart, user]);

  const onRemove = (id) => {
    const values = {
      ItemId: id,
    };
    dispatch(CartServices.deleteCartItem(values))
      .unwrap()
      .then((res) => {
        if (res.StatusCode === 200) {
          message.success({
            content: "Cập nhật thành công",
            duration: 2,
          });
        } else {
          message.error({
            content: "Thao tác thất bại: " + res.Message,
            duration: 2,
            style: {
              marginTop: "3vh",
            },
          });
        }
      })
      .catch((err) => {
        message.error({
          content: err.Payload.TranslateContext + " : " + err.Message,
          duration: 2,
          style: {
            marginTop: "3vh",
          },
        });
      });
  };

  return (
    <div className="container my-4">
      <Form
        form={form}
        initialValues={cart}
        style={{
          marginBottom: "10px",
          borderBottom: "1px solid #ddd",
          paddingBottom: "10px",
        }}
      >
        <Form.Item hidden name={"UserId"}>
          <Input />
        </Form.Item>
        <Form.List name={"CartDetails"}>
          {(fields, { add, remove }) => (
            <div className="row">
              {fields.map(({ key, name, ...restField }) => (
                <>
                  <Form.Item className="col-6" name={[name, "ImageUrl"]}>
                    <img
                      width={"50%"}
                      src={cart?.CartDetails[name]?.ImageUrl}
                      alt=""
                    />
                  </Form.Item>
                  <div className="col-6 row">
                    <Form.Item className="col-12" name={[name, "Name"]}>
                      <Input readOnly />
                    </Form.Item>
                    <Form.Item>
                      {cart.CartDetails[name].ProductVariants.VariantValues.map(
                        (el) => (
                          <span className="mx-2">
                            {el.Options.Name}:
                            <b className="mx-2">{el.OptionValues.Value}</b>
                          </span>
                        )
                      )}
                    </Form.Item>
                    <Form.Item
                      className="col-4"
                      {...restField}
                      name={[name, "ProductVariants", "SkuId"]}
                    >
                      <Input readOnly />
                    </Form.Item>
                    <Form.Item
                      className="col-4"
                      {...restField}
                      name={[name, "Quantity"]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item className="col-4">
                      <Button
                        className="bg-danger"
                        onClick={() => {
                          onRemove(cart.CartDetails[name].Id);
                          remove(name);
                        }}
                      >
                        <DeleteOutlined />
                      </Button>
                    </Form.Item>
                  </div>
                </>
              ))}
            </div>
          )}
        </Form.List>
        <Form.Item className="d-flex justify-content-end">
          <Button type="primary" htmlType="submit">
            <Link to={"/order-user"} className="nav-link">
              Thanh Toán
            </Link>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Cart;
