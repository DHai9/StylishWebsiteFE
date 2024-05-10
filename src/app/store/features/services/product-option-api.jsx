import { axiosClient, axiosImage } from "./axios-client";

class ProductOptionApi {
  ///SignIn
  getListProductOption() {
    return axiosClient({
      method: "get",
      url: "/odata/ProductOptions",
    });
  }
  addProductOption(payload) {
    return axiosClient({
      method: "post",
      url: "/odata/ProductOptions",
      data: payload,
    });
  }
  updateProductOption(id, payload) {
    return axiosClient({
      method: "put",
      url: `/odata/ProductOptions(${id})`,
      data: payload,
    });
  }
  getDetailsProductOption(key) {
    return axiosClient({
      method: "get",
      url: `/odata/ProductOptions(${key})`,
    });
  }
  deleteProductOption(key){
    return axiosClient({
      method: "delete",
      url: `/odata/ProductOptions(${key})`,
    });
  }
}

export default new ProductOptionApi();
