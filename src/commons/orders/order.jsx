import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  Form,
  Button,
  Select,
  Modal,
  Tag,
  InputNumber,
  Divider,
  Image,
  Popconfirm,
  message,
} from "antd";
import { Link } from "react-router-dom";
import { AiFillDelete, AiOutlineSearch } from "react-icons/ai";
import { OrderServices, AuthorServices } from "../../app/store/features";
import OrderCart from "./order-cart";
import textUtilities from "../utilities/text-utilities";

const Order = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const orders = useSelector((state) => state.orderReducer.orders);
  const user = useSelector((state) => state.userReducer.user);
  const loading = useSelector((state) => state.orderReducer.loading);
  const can_reload = useSelector((state) => state.orderReducer.can_reload);
  const error = useSelector((state) => state.orderReducer.error);
  const [open, setOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [amounts, setAmounts] = useState([]);
  const [canUpdate, setCanUpdate] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(AuthorServices.initUserFromLocal());
    }
    if ((user && orders.length === 0) || can_reload) {
      console.log(1);
      let query = "UserId eq " + user?.Id;
      dispatch(OrderServices.getOrderListByUser(query));
    }
    form.resetFields();
  }, [dispatch, orders, user, can_reload]);

  const onFilter = (el) => {
    let query = `UserId eq ${user?.Id}`;
    if (el.OrderCode) {
      query += `  and OrderCode eq '${el.OrderCode}'`;
    }
    if (el.UserName) {
      query += ` and UserName eq '${el.UserName}'`;
    }
    if (el.Status) {
      query += ` and Status eq ${el.Status}`;
    }
    dispatch(OrderServices.getOrderListByUser(query));
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const options = [
    {
      label: "Chưa thanh toán",
      value: "0",
    },
    {
      label: "Chờ tiếp nhận",
      value: "1",
    },
    {
      label: "Đang xử lý",
      value: "2",
    },
    {
      label: "Đang giao",
      value: "3",
    },
    {
      label: "Đã giao",
      value: "4",
    },
    {
      label: "Hoàn thành",
      value: "5",
    },
    {
      label: "Đã hủy",
      value: "8",
    },
  ];

  // Function to handle form reset
  const handleReset = () => {
    if (isModified) {
      form.resetFields();
    }
    setIsModified(false);
  };

  // Function to handle form change
  const onValuesChange = (_, allValues) => {
    if (!isModified) {
      setIsModified(true);
    }
    // You can also compare initialValues with allValues here
  };

  const showModal = (el) => {
    setOrderDetail(el);
    setCanUpdate(isUpdate());
    setTotalAmount(el.TotalAmount);
    let array = [];
    el.OrderDetails.map((el) => {
      let newObj = {
        Quantity: el.Quantity,
        Price: el.Price,
      };
      array.push(newObj);
    });
    setAmounts(array);
    form.resetFields();
    setOpen(true);
  };

  const handleOk = (e) => {
    setOpen(false);
  };

  const handleCancel = (e) => {
    setOpen(false);
  };

  const onUpdate = (e) => {
    e.TotalAmount = totalAmount;
    setOpen(false);
    dispatch(OrderServices.updateOrder(e))
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
      });
  };

  const setOrderNew = () => {
    dispatch(OrderServices.setOrderUpdate(orderDetail));
  };

  const getButtonUpdate = () => {
    switch (orderDetail.Status) {
      case 0:
        return (
          <div className="row">
            <Form.Item className="col-4">
              <Button
                onClick={() => setOrderNew()}
                className="bg-primary text-light"
              >
                <Link to={"/"} className="nav-link">
                  Tiếp tục mua sắm
                </Link>
              </Button>
            </Form.Item>
            <Form.Item className="col-3">
              <Popconfirm
                title="THANH TOÁN"
                description="Tiến hành thanh toán đơn hàng?"
                okText="Thanh toán"
                showCancel={false}
                onConfirm={() => updatePayment(1)}
              >
                <Button className="bg-success text-light">Thanh Toán</Button>
              </Popconfirm>
            </Form.Item>
            <Form.Item className="col-3">
              <Button
                htmlType="submit"
                className="text-light"
                style={{ backgroundColor: "#3B94DC" }}
              >
                Cập Nhật
              </Button>
            </Form.Item>
            <Form.Item className="col-2">
              <Popconfirm
                title="HỦY ĐƠN"
                description="Bạn chắc chắn muốn hủy đơn hàng?"
                okText="Xác nhận hủy"
                showCancel={false}
                onConfirm={() => updatePayment(8)}
              >
                <Button className="bg-danger text-light">Hủy</Button>
              </Popconfirm>
            </Form.Item>
          </div>
        );
      case 5:
        return (
          <Form.Item>
            <Button className="bg-success">Đánh Giá</Button>
          </Form.Item>
        );
      case 8:
        return (
          <Form.Item>
            <Popconfirm
              title="ĐẶT LẠI ĐƠN"
              description="Bạn muốn đặt lại đơn hàng?"
              okText="Đặt lại"
              showCancel={false}
              onConfirm={() => updatePayment(0)}
            >
              <Button className="bg-success">Đặt Lại</Button>
            </Popconfirm>
          </Form.Item>
        );
    }
  };

  const updatePayment = (status) => {
    setOpen(false);
    var obj = {};
    Object.assign(obj, orderDetail);
    if (obj.Status === 8) {
      obj.OrderCode = textUtilities.generateOrderCode();
      dispatch(OrderServices.addOrder(obj))
        .unwrap()
        .then((res) => {
          if (res.StatusCode === 200) {
            let query = "UserId eq " + user?.Id;
            dispatch(OrderServices.getOrderListByUser(query));
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
        });
    } else {
      obj.Status = status;
      dispatch(OrderServices.updateOrder(obj))
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
        });
    }
  };

  const removeVariantItem = (id) => {
    var obj = {
      OrderId: orderDetail.Id,
      ItemId: id,
    };
    dispatch(OrderServices.deleteItem(obj))
      .unwrap()
      .then((res) => {
        if (res.StatusCode === 200) {
          form.resetFields();
          setOrderDetail(res.Payload);
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
      });
  };

  const getStatusOrderStr = (status_order) => {
    switch (status_order) {
      case 0:
        return <Tag color="#87d068">Chưa thanh toán</Tag>;
      case 1:
        return <Tag color="#2db7f5">Chờ tiếp nhận</Tag>;
      case 2:
        return (
          <Tag color="#51c9c7" className="text-danger">
            Đang xử lý
          </Tag>
        );
      case 3:
        return (
          <Tag color="#00ff48" className="text-danger">
            Đã giao vận chuyển
          </Tag>
        );
      case 4:
        return <Tag color="#401b7a">Đang giao</Tag>;
      case 5:
      case 6:
        return <Tag color="#108ee9">Đã giao</Tag>;
      case 7:
        return (
          <Tag color="#78f542" className="text-body">
            Hoàn thành
          </Tag>
        );
      default:
        return <Tag color="#7d0404">Đã hủy</Tag>;
    }
  };

  const isUpdate = () => {
    switch (orderDetail.Status) {
      case 0:
        return false;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        return true;
    }
  };

  const changeQuantity = (e, index) => {
    let newAmounts = [...amounts];
    newAmounts[index].Quantity = e;
    let total = 0;
    amounts.map((el) => (total += el.Quantity * el.Price));
    setTotalAmount(total);
  };

  if (!orders || loading) {
    return <>LOADDING...</>;
  } else if (error && error.TranslateKey !== "304") {
    return <>FAILD LOAD...</>;
  }
  return (
    <div className="container my-5 shadow-lg">
      <Form onFinish={onFilter} className="row py-3 bg-nav-search">
        <Form.Item label={"Trạng thái"} name={"Status"} className="col-3">
          <Select
            showSearch
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            filterOption={filterOption}
            options={options}
          />
        </Form.Item>
        <Form.Item label={"Mã Đơn"} name={"OrderCode"} className="col-3">
          <Input />
        </Form.Item>
        <Form.Item
          label={"Số Đện thoại"}
          name={"PhoneNumber"}
          className="col-3"
        >
          <Input />
        </Form.Item>
        <Form.Item className="col-3">
          <Button htmlType="submit">
            <AiOutlineSearch />
          </Button>
        </Form.Item>
      </Form>
      {orders &&
        orders.map((el, index) => (
          <div onClick={() => showModal(el)}>
            <OrderCart key={`OrderCart-${index}`} props={el} />
          </div>
        ))}
      <Modal
        title={`${orderDetail.OrderCode}`}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
      >
        <Form
          onLoad={handleReset}
          onValuesChange={onValuesChange}
          form={form}
          initialValues={orderDetail}
          onFinish={onUpdate}
        >
          <Divider>
            <b>
              {getStatusOrderStr(orderDetail.Status)} {orderDetail.NoteCancel}
            </b>
          </Divider>
          <div className="row">
            <Form.Item hidden className="col-6" name={"Id"}>
              <Input />
            </Form.Item>
            <Form.Item hidden className="col-6" name={"UserId"}>
              <Input />
            </Form.Item>
            <Form.Item hidden className="col-6" name={"OrderCode"}>
              <Input />
            </Form.Item>
            <Form.Item className="col-6" label={"Người Nhận"} name={"UserName"}>
              <Input readOnly={canUpdate} />
            </Form.Item>
            <Form.Item
              className="col-6"
              label={"Số Điện Thoại"}
              name={"PhoneNumber"}
            >
              <Input readOnly={canUpdate} />
            </Form.Item>
          </div>
          <div className="row">
            <Form.Item className="col-6" label={"Giảm Giá"} name={"TotalSale"}>
              <Tag>
                <b>{orderDetail.TotalSale}</b>
              </Tag>
            </Form.Item>
            <Form.Item
              className="col-6"
              label={"Tổng Tiền"}
              name={"TotalAmount"}
            >
              <Tag>
                <b>{textUtilities.numberToMenyStr(totalAmount)}</b>
              </Tag>
            </Form.Item>
          </div>
          <Form.Item className="col-6" label={"Địa Chỉ"} name={"DetailAddress"}>
            <Input readOnly={canUpdate} />
          </Form.Item>
          <div className="row">
            <Form.List name={"OrderDetails"}>
              {(products, { add, remove }) => (
                <div className="row row justify-content-between">
                  {products.map((product, key, name, ...restField) => (
                    <div className="row">
                      <Divider>
                        <Tag>{`Product: ${key}`}</Tag>
                      </Divider>
                      <Form.Item name={[name, "Id"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[name, "OrderId"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item name={[name, "ProductVariantId"]} hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        className="col-12"
                        {...restField}
                        label={"Tên: "}
                        name={[product.name, "Name"]}
                      >
                        <b>{orderDetail.OrderDetails[product.name]?.Name}</b>
                        <Input hidden readOnly />
                      </Form.Item>
                      <Form.Item
                        className="col-12"
                        {...restField}
                        label={"Mã: "}
                        name={[product.name, "ProductVariant", "SkuId"]}
                      >
                        <b>
                          {
                            orderDetail.OrderDetails[product.name]
                              ?.ProductVariant?.SkuId
                          }
                        </b>
                        <Input hidden readOnly />
                      </Form.Item>
                      <Form.Item
                        className="col-6"
                        {...restField}
                        name={[product.name, "Quantity"]}
                        label={`Số lượng kho ${
                          orderDetail.OrderDetails[product.name]?.ProductVariant
                            ?.Quantity
                        }`}
                      >
                        <InputNumber
                          onChange={(e) => changeQuantity(e, product.name)}
                          initialValues={
                            orderDetail.OrderDetails[product.name]
                              ?.ProductVariant?.Quantity
                          }
                          min={1}
                          max={
                            orderDetail.OrderDetails[product.name]
                              ?.ProductVariant?.Quantity
                          }
                          readOnly={canUpdate}
                        />
                      </Form.Item>
                      <Form.Item
                        className="col-4"
                        {...restField}
                        label={"Giá: "}
                        name={[product.name, "ProductVariant", "Price"]}
                      >
                        <b>
                          {textUtilities.numberToMenyStr(
                            orderDetail.OrderDetails[product.name]
                              ?.ProductVariant?.Price
                          )}
                        </b>
                        <Input hidden readOnly />
                      </Form.Item>
                      <Form.Item
                        className="col-9"
                        {...restField}
                        label={"Ảnh: "}
                        name={[product.name, "ImageUrl"]}
                      >
                        <Image
                          width={100}
                          src={orderDetail.OrderDetails[product.name]?.ImageUrl}
                        />
                        <Input hidden />
                      </Form.Item>
                      {/* Button delete imtem */}
                      {orderDetail.OrderDetails.length > 1 ? (
                        <Form.Item className="col-3 d-flex justify-content-end align-self-end">
                          <Popconfirm
                            title="XÓA SẢN PHẨM"
                            description="Bạn chắc chắn xóa sản phẩm?"
                            okText="Xóa"
                            showCancel={false}
                            onConfirm={() =>
                              removeVariantItem(
                                orderDetail.OrderDetails[product.name]?.Id
                              )
                            }
                          >
                            <Button size="small" className="bg-danger">
                              <AiFillDelete />
                            </Button>
                          </Popconfirm>
                        </Form.Item>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Form.List>
          </div>
          {getButtonUpdate()}
        </Form>
      </Modal>
    </div>
  );
};

export default Order;
