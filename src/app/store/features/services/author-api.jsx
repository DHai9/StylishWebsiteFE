import { axiosClient } from "./axios-client";

class AuthorApi {
  register(payload) {
    return axiosClient({
      method: "post",
      url: "/odata/Users/Register",
      data: payload,
    });
  }
  signin(payload){
    return axiosClient({
        method:"post",
        url:"/odata/Users/Signin",
        data:payload
    })
  }
}

export default new AuthorApi();
