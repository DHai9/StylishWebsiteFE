import React from "react";
import { Card, Tag } from "antd";
import { AiFillEye, AiOutlineExclamationCircle } from "react-icons/ai";
import textUtilities from "../utilities/text-utilities";

const OrderCart = ({ props }) => {
  const order = { ...props };

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

  return (
    <div className="my-2">
      <Card title={`${order.OrderCode} ${order.NoteCancel ? ` _____ Lý do hủy: ${order.NoteCancel}` : ""}` } bordered={false}>
        <div className="d-flex justify-content-center">
          {getStatusOrderStr(order.Status)}
        </div>
        <div className="row">
          <div className="col">
            <b>Tổng sản phẩm: </b>
            {order.OrderDetails?.length}
          </div>
          <div className="col">
            <b>Tổng tiền: </b>
            {textUtilities.numberToMenyStr(order.TotalAmount)}
          </div>
          <div className="col">
            <b>Số diện thoại: </b>
            {order.PhoneNumber}
          </div>
          <div className="col">
            <b>Người nhận: </b>
            {order.UserName}
          </div>
        </div>
        <div className="row my-2">
          <div className="col-8">
            <b>Địa chỉ nhận: </b>
            {order.DetailAddress}
          </div>
          <div className="col-4">
            <b className="text-danger">Thao tác: </b>
            <AiOutlineExclamationCircle type="button" className="mx-2" />
            <AiFillEye className="mx-2" type="button" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderCart;
