import { axiosClient } from "./axios-client";

class StatisticalApi {
  getProductStatistical(query) {
    return axiosClient({
      method: "get",
      url: "/odata/ProductsStatisticals?$count=true" + query,
    });
  }
  getUserStatistical(query) {
    return axiosClient({
      method: "get",
      url:
        "odata/UserStatisticals?$count=true" +
        query +
        "&$orderby=SumMoney desc",
    });
  }
  getProductBestsaller(options) {
    return axiosClient({
      method: "get",
      url: `/odata/ProductsStatisticals/GetProductsBestSeller(month=${options.Month},year=${options.Year},skuId=${options.SkuId})`,
    });
  }
}

export default new StatisticalApi();
