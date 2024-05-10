import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  InputNumber,
  Input,
  message,
  Divider,
  Tag,
  Select,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
  OrderServices,
  CartServices,
  AuthorServices,
} from "../../app/store/features";
import { TextUtilities } from "..";
const UserOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const user = useSelector((state) => state.userReducer.user);
  const cart = useSelector((state) => state.cartReducer.cart);
  const [prices, setPrices] = useState([0, 0, 0]); // ImportPrice, Price, Dicount
  const [detail, setDetail] = useState([]);
  useEffect(() => {
    if (!user) {
      dispatch(AuthorServices.initUserFromLocal());
    }
    if (!cart && user !== null) {
      dispatch(CartServices.getCartByUserId(user.Id));
    }
    if (cart) {
      let detail_cart = [];
      cart.CartDetails.map((e) => {
        detail_cart.push({
          Quantity: e.Quantity,
          ImportPrice: e.ProductVariants.ImportPrice,
          Price: e.ProductVariants.Price,
        });
      });
      setDetail(detail_cart);
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

  const onChangeQuantity = (index, e) => {
    let temp = [...detail];
    temp[index].Quantity = e;
    setDetail(temp);
    getDetailOrderPay();
  };

  const onFinish = (values) => {
    values = { ...values, OrderDetails: values.CartDetails, CartId: cart.Id };
    dispatch(OrderServices.addOrder(values))
      .unwrap()
      .then((res) => {
        if (res.StatusCode === 200) {
          message.success({
            content: "Payment success",
            duration: 2,
          });
          navigate("/");
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

  const getDetailOrderPay = () => {
    var discount = 0;
    var total_money = 0;
    let tempPrice = [0, 0, 0];
    detail.forEach((element) => {
      tempPrice[0] = tempPrice[0] + element.Quantity * element.ImportPrice;
      tempPrice[1] = tempPrice[1] + element.Quantity * element.Price;
    });
    total_money = tempPrice[1] - tempPrice[0];
    if (total_money >= 50000 && total_money < 500000)
      discount = (total_money / 100) * 10;
    else if (total_money >= 500000 && total_money < 1000000)
      discount = (total_money / 100) * 15;
    else if (total_money >= 1000000 && total_money < 5000000)
      discount = (total_money / 100) * 20;
    else if (total_money >= 5000000) discount = (total_money / 100) * 45;
    else discount = 0;
    tempPrice[2] = discount;
    setPrices(tempPrice);
  };
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const options = [
    {
      label: "Chuyển Khoản",
      value: 1,
    },
    {
      label: "Tiền Mặt",
      value: 2,
    },
  ];

  return (
    <div className="container my-4">
      <Form
        form={form}
        onLoad={getDetailOrderPay}
        onFinish={onFinish}
        initialValues={cart}
        style={{
          marginBottom: "10px",
          borderBottom: "1px solid #ddd",
          paddingBottom: "10px",
        }}
      >
        <Divider>
          <b>User Info</b>
        </Divider>
        <Form.Item hidden name={"UserId"}>
          <Input />
        </Form.Item>
        <div className="row">
          <Form.Item
            readOnly
            className="col-4"
            name={"OrderCode"}
            label={"Mã"}
            rules={[{ required: true, message: "Không được để trống" }]}
            initialValue={TextUtilities.generateOrderCode()}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            className="col-4"
            name={"UserName"}
            label={"Người Nhận"}
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            initialValue={""}
            className="col-4"
            name={"Note"}
            label={"Ghi Chú"}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="row">
          <Form.Item
            className="col-8"
            name={"DetailAddress"}
            label={"Địa Chỉ"}
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="col-4"
            name={"PhoneNumber"}
            label={"Số Điện Thoại"}
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>
        </div>
        <Divider>
          <b>Detail Order</b>
        </Divider>
        <div className="row">
          <div className="col-8">
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
                          {cart.CartDetails[
                            name
                          ].ProductVariants.VariantValues.map((el, index) => (
                            <>
                              {index % 2 === 0 ? <br /> : ""}
                              <span className="mx-2">
                                {el.Options.Name}:
                                <b className="mx-2">{el.OptionValues.Value}</b>
                              </span>
                            </>
                          ))}
                        </Form.Item>
                        <Form.Item
                          className="col-6"
                          {...restField}
                          label="Mã: "
                          name={[name, "ProductVariants", "SkuId"]}
                        >
                          <Input readOnly />
                        </Form.Item>
                        <Form.Item
                          className="col-6"
                          {...restField}
                          label="Giá: "
                          name={[name, "ProductVariants", "Price"]}
                        >
                          <Input readOnly />
                        </Form.Item>
                        <Form.Item
                          hidden
                          className="col-12"
                          {...restField}
                          name={[name, "ImportPrice"]}
                          initialValue={
                            cart.CartDetails[name].ProductVariants.ImportPrice
                          }
                        >
                          <Input readOnly />
                        </Form.Item>
                        <Form.Item
                          hidden
                          className="col-6"
                          {...restField}
                          label="Giá: "
                          name={[name, "Price"]}
                          initialValue={
                            cart.CartDetails[name].ProductVariants.Price
                          }
                        ></Form.Item>
                        <Form.Item
                          className="col-6"
                          {...restField}
                          label="Số Lượng: "
                          name={[name, "Quantity"]}
                        >
                          <InputNumber
                            onChange={(e) => onChangeQuantity(name, e)}
                            min={1}
                          />
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
          </div>
          <div className="col-4">
            <div className="row"></div>
            <Form.Item className="col-12" label={"Thành Tiền: "}>
              <Tag className="text-danger">
                {TextUtilities.numberToMenyStr(prices[1])}
              </Tag>
            </Form.Item>
            <Form.Item className="col-12" label={"Giảm Giá: "}>
              <Tag className="text-danger">
                {TextUtilities.numberToMenyStr(prices[2])}
              </Tag>
            </Form.Item>
            <Form.Item className="col-12" label={"Tổng Tiền: "}>
              <Tag className="text-danger">
                {TextUtilities.numberToMenyStr(prices[1] - prices[2])}
              </Tag>
            </Form.Item>
            <Form.Item
              label={"Hình Thức Thanh Toán: "}
              name={"TypePay"}
              className="col-12"
              rules={[
                {
                  required: true,
                  message: "Không được để trống",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Chọn loại thanh toán"
                optionFilterProp="children"
                filterOption={filterOption}
                options={options}
              />
            </Form.Item>
            <Form.Item className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                Tạo Hóa Đơn
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UserOrder;
