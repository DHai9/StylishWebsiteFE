import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Flex,
  Button,
  Tag,
  Input,
  Form,
  Select,
  Popconfirm,
  Modal,
  message,
} from "antd";
import {
  PlusSquareOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { CreateOption, UpdateOption } from "../../commons";
import { OrderServices } from "../../app/store/features";

const OrderList = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orderReducer.orders);
  const loading = useSelector((state) => state.optionReducer.loading);
  const can_reload = useSelector((state) => state.optionReducer.can_reload);
  const error = useSelector((state) => state.optionReducer.error);

  const [open, setOpen] = useState(true);
  const [openUpdate, setOpenUpdate] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState("");
  const [orderUpdate, setOrderUpdate] = useState(null);
  useEffect(() => {
    if (orders.length === 0 || can_reload) {
      let query = `&$filter=IsDeleted eq false`;
      dispatch(OrderServices.getOrderList(query));
    }
  }, [dispatch, orders, can_reload]);

  /* table function */

  const showCreate = () => {
    setOpen(!open);
    setOpenUpdate(true);
  };

  const updatePayment = (status, order) => {
    order.Status = status;
    order.NoteCancel = note;
    dispatch(OrderServices.updateOrder(order))
      .unwrap()
      .then((res) => {
        if (res.StatusCode === 200) {
          setNote("");
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

  const showModal = (order) => {
    console.log(order);
    setOrderUpdate(order);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    updatePayment(8, orderUpdate);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChangeNote = (e) => {
    setNote(e.target.value);
  };

  const getButtonUpdate = (order) => {
    switch (order.Status) {
      case 1:
        return (
          <div className="row">
            <div className="col-4 mx-1">
              <Popconfirm
                title="TIẾP NHẬN ĐƠN"
                description="Bạn chắc chắn tiếp nhận đơn?"
                okText="Tiếp Nhận"
                onConfirm={() => updatePayment(2, order)}
              >
                <Tag type="button" color="#f5aa42">
                  Nhận Đơn
                </Tag>
              </Popconfirm>
            </div>
            <div className="col-4 mx-1">
              <Tag
                onClick={() => showModal(order)}
                type="button"
                color="#DC3B3B"
              >
                Hủy Đơn
              </Tag>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="row">
            <div className="col-4 mx-1">
              <Popconfirm
                title="GIAO SHIP"
                description="Xác nhận bàn giao đơn cho ship?"
                okText="Xác Nhận"
                onConfirm={() => updatePayment(3, order)}
              >
                <Tag type="button" color="#66ab1d">
                  Giao Ship
                </Tag>
              </Popconfirm>
            </div>
            <div className="col-4 mx-1">
              <Tag
                onClick={() => showModal(order)}
                type="button"
                color="#DC3B3B"
              >
                Hủy Đơn
              </Tag>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="row">
            <div className="col-4 mx-1">
              <Popconfirm
                title="XÁC NHẬN GIAO KHÁCH"
                description="Bạn muốn xác nhận giao hàng cho khách?"
                okText="Xác Nhận"
                onConfirm={() => updatePayment(4, order)}
              >
                <Tag type="button" color="#0f68f7">
                  Giao Khách
                </Tag>
              </Popconfirm>
            </div>
            <div className="col-4 mx-1">
              <Tag
                onClick={() => showModal(order)}
                type="button"
                color="#DC3B3B"
              >
                Hủy Đơn
              </Tag>
            </div>
          </div>
        );
    }
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
        return <Tag color="#401b7a">Đang giao</Tag>;
      case 4:
        return <Tag color="#108ee9">Đã giao</Tag>;
      default:
        return <Tag color="#7d0404">Đã hủy</Tag>;
    }
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
      label: "Đã hủy",
      value: "8",
    },
  ];

  /* table setting */

  const columns = [
    {
      title: "Mã Đơn",
      dataIndex: "OrderCode",
      key: "OrderCode",
    },
    {
      title: "Người Nhận",
      dataIndex: "UserName",
      key: "UserName",
    },
    {
      title: "Trạng Thái",
      dataIndex: "Status",
      key: "Status",
      render: (e) => getStatusOrderStr(e),
    },
    {
      title: "Liên Hệ Người Nhận",
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
    },
    {
      title: "Địa Chỉ",
      dataIndex: "DetailAddress",
      key: "DetailAddress",
    },
    {
      title: "Ghi Chú",
      dataIndex: "Note",
      key: "Note",
    },
    {
      title: "Lý Do Hủy",
      dataIndex: "NoteCancel",
      key: "NoteCancel",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (e) => getButtonUpdate(e),
    },
  ];

  const columns_orderDetails = [
    {
      title: "Product Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "SkuId",
      dataIndex: "ProductVariant",
      key: "ProductVariant",
      render: (e) => (
        <>
          <Tag>{e?.SkuId}</Tag>
        </>
      ),
    },
    {
      title: "Price",
      dataIndex: "ProductVariant",
      key: "ProductVariant",
      render: (e) => (
        <>
          <Tag>{e?.Price} VND</Tag>
        </>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
  ];

  const onFilter = (el) => {
    let query = `&$filter=IsDeleted eq false`;
    if (el.OrderCode) {
      query += `  and OrderCode eq '${el.OrderCode}'`;
    }
    if (el.UserName) {
      query += ` and UserName eq '${el.UserName}'`;
    }
    if (el.Status) {
      query += ` and Status eq ${el.Status}`;
    }
    dispatch(OrderServices.getOrderList(query));
  };

  const dataSourceWithKeys = orders.map((item) => {
    return { ...item, key: item.Id };
  });

  /* end table setting */

  if (!orders || loading) {
    return <>LOADDING...</>;
  } else if (error && error.TranslateKey !== "304") {
    return <>FAILD LOAD...</>;
  }

  return (
    <div>
      <Form onFinish={onFilter} className="row py-3 bg-nav-search">
        <Form.Item label={"Trạng Thái"} name={"Status"} className="col-3">
          <Select
            showSearch
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            filterOption={filterOption}
            options={options}
          />
        </Form.Item>
        <Form.Item label={"Mã Hóa Đơn"} name={"OrderCode"} className="col-3">
          <Input />
        </Form.Item>
        <Form.Item
          label={"Số Điện Thoại"}
          name={"PhoneNumber"}
          className="col-3"
        >
          <Input />
        </Form.Item>
        <Form.Item className="col-3">
          <Button htmlType="submit">
            <SearchOutlined />
          </Button>
        </Form.Item>
      </Form>

      {openUpdate ? (
        <></>
      ) : (
        <div className="bg-white p-5">
          <CloseCircleOutlined
            onClick={() => setOpenUpdate(true)}
            className="d-flex justify-content-end inline-block pt-1 text-danger"
          />
          <UpdateOption />
        </div>
      )}
      <Table
        className="shadow-lg rounded"
        dataSource={dataSourceWithKeys}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <p
              style={{
                margin: 0,
              }}
            >
              <Table
                columns={columns_orderDetails}
                dataSource={record.OrderDetails}
              />
            </p>
          ),
          rowExpandable: (record) => record.name !== "Not Expandable",
        }}
      />
      <Modal
        title="Xác Nhận Hủy Đơn"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <label>Lý do hủy: </label>
          <Input onChange={onChangeNote} />
        </div>
      </Modal>
    </div>
  );
};

export default OrderList;
