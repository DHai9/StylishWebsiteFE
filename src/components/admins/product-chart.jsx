import React from "react";
import { ChartProducts, ChartBestsaller } from "../../commons";

const ProductChart = () => {
  return (
    <div className="shadow-lg rounded row">
      <div className="col-12">
        <ChartBestsaller />
      </div>
      <div className="col-12">
        <ChartProducts />
      </div>
    </div>
  );
};

export default ProductChart;
