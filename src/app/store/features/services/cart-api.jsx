import { axiosClient } from "./axios-client";

class CartApi {
  ///SignIn
  getListCarts() {
    return axiosClient({
      method: "get",
      url: "/odata/Carts",
    });
  }
  getByUserId(id) {
    return axiosClient({
      method: "get",
      url: `/odata/Carts/GetByUserId(userId=${id})`,
    });
  }
  addCartItem(payload) {
    return axiosClient({
      method: "post",
      url: `/odata/Carts/AddItem`,
      data: payload,
    });
  }
  updateCarts(id, payload) {
    return axiosClient({
      method: "put",
      url: `/odata/Carts(${id})`,
      data: payload,
    });
  }
  deleteCarts(key) {
    return axiosClient({
      method: "delete",
      url: `/odata/Carts(${key})`,
    });
  }
  deleteItem(payload) {
    return axiosClient({
      method: "post",
      url: `/odata/Carts/DeleteItem`,
      data: payload
    });
  }
}

export default new CartApi();
