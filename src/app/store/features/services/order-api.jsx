import { axiosClient } from "./axios-client";

class OrderApi {
  ///SignIn
  getListOrder(odata_query) {
    return axiosClient({
      method: "get",
      url: "/odata/Orders?$count=true" + odata_query + "&$orderby=Status",
    });
  }
  getListOrderByUser(odata_query) {
    return axiosClient({
      method: "get",
      url:
        "/odata/Orders?$count=true&$filter=" + odata_query + "&$orderby=Status",
    });
  }
  addOrder(payload) {
    return axiosClient({
      method: "post",
      url: "/odata/Orders",
      data: payload,
    });
  }
  getByUserId(id) {
    return axiosClient({
      method: "get",
      url: `/odata/Orders/GetByUserId(userId=${id})?$orderby=Status`,
    });
  }
  getOrderNew(user_Id) {
    return axiosClient({
      method: "get",
      url: `/odata/Orders?$count=true&$filter=UserId eq ${user_Id} and Status eq 0`,
    });
  }
  updateOrder(payload) {
    return axiosClient({
      method: "put",
      url: `/odata/Orders/${payload.Id}`,
      data: payload,
    });
  }
  deleteCarts(key) {
    return axiosClient({
      method: "delete",
      url: `/odata/Orders(${key})`,
    });
  }
  deleteItem(payload) {
    return axiosClient({
      method: "post",
      url: `/odata/Orders/DeleteItem`,
      data: payload
    });
  }
}

export default new OrderApi();
