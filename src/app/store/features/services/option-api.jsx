import { axiosClient } from "./axios-client";

class OptionApi {
  ///SignIn
  getListOption() {
    return axiosClient({
      method: "get",
      url: "/odata/Options",
    });
  }
  getListOptionByType(type) {
    return axiosClient({
      method: "get",
      url: `/odata/Options/GetByType(type=${type})`,
    });
  }
  addOption(payload) {
    return axiosClient({
      method: "post",
      url: "/odata/Options",
      data: payload,
    });
  }
  updateOption(id, payload) {
    return axiosClient({
      method: "put",
      url: `/odata/Options(${id})`,
      data: payload,
    });
  }
  getOptionDetails(key, id) {
    return axiosClient({
      method: "get",
      url: `/odata/Options(${key})/GetVariant(id=${id})`,
    });
  }
  deleteProductOption(key) {
    return axiosClient({
      method: "delete",
      url: `/odata/Options(${key})`,
    });
  }
}

export default new OptionApi();
