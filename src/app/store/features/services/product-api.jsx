import { axiosClient, axiosImage } from "./axios-client";

class ProductApi {
  ///SignIn
  getListProduct(query) {
    return axiosClient({
      method: "get",
      url: `/odata/Products?$count=true${query}&$orderby=CreatedTime desc`,
    });
  }
  addProduct(payload) {
    return axiosClient({
      method: "post",
      url: "/odata/Products",
      data: payload,
    });
  }
  updateProduct(id, payload) {
    return axiosClient({
      method: "put",
      url: `/odata/Products(${id})`,
      data: payload,
    });
  }
  getProductDetails(key) {
    return axiosClient({
      method: "get",
      url: `/odata/Products(${key})`,
    });
  }
  deleteProduct(key){
    return axiosClient({
      method: "delete",
      url: `/odata/Products(${key})`,
    });
  }
  addImage(formData) {
    return axiosImage({method: "post", data: formData });
  }
}

export default new ProductApi();
