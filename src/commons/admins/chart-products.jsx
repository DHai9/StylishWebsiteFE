import React, { useEffect, useState } from "react";
import { Table, Pagination, Flex, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Chart, Line, Interval, Axis, Tooltip, Legend } from "bizcharts";
import { StatisticalServices } from "../../app/store/features";
import { TextUtilities } from "../../commons";

const ChartProducts = () => {
  const dispatch = useDispatch();
  const statisticals = useSelector(
    (state) => state.statisticalReducer.statisticals
  );
  const loading = useSelector((state) => state.statisticalReducer.loadding);
  const error = useSelector((state) => state.statisticalReducer.error);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (statisticals.length === 0) {
      var query = ``;
      dispatch(StatisticalServices.getProductStatistical(query));
    }
    setData(statisticals.slice(0, 5));
  }, [dispatch, statisticals, loading, error]);

  const onChange = (page) => {
    page--;
    setData(statisticals.slice(page * 5, page * 5 + 5));
  };

  const bestsaller_columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "SkuId",
      dataIndex: "SkuId",
      key: "SkuId",
    },
    {
      title: "TotalSale",
      dataIndex: "TotalSale",
      key: "TotalSale",
    },
    {
      title: "Revenue",
      dataIndex: "Revenue",
      key: "Revenue",
      render: (e) => TextUtilities.numberToMenyStr(e),
    },
    {
      title: "Rate",
      dataIndex: "Rate",
      key: "Rate",
    },
  ];

  if (error) {
    return <div>Error: {error}</div>;
  }

  const dataSourceWithKeys = statisticals?.map((item) => {
    return { ...item, key: item.Id };
  });

  return (
    <div className="row">
      <h2 className="d-flex justify-content-center">Products Best Sellers</h2>
      <div className="my-2 col-6 shadow-lg rounded">
        <Chart height={400} data={data} autoFit>
          <Legend />
          <Axis name="SkuId" />
          <Axis name="Revenue" />
          <Axis name="TotalSale" />
          <Tooltip shared />
          <Line position="SkuId*Revenue" color="red" />
          <Line position="SkuId*TotalSale" color="blue" />
        </Chart>
      </div>
      <div className="my-2 col-6 shadow-lg rounded">
        <Chart height={400} data={data} autoFit>
          <Tooltip shared />
          <Axis name="Revenue" />
          <Axis name="TotalSale" />
          <Interval size={20} position="Revenue*TotalSale" color="SkuId" />
        </Chart>
      </div>
      <div className="d-flex justify-content-center">
        <Pagination
          size="small"
          onChange={onChange}
          className="mt-5"
          defaultCurrent={1}
          total={Math.ceil(statisticals.length / 5) * 5}
          pageSize={5}
        />
      </div>
      {!loading ? (
        <>
          <div className="mt-2">
            <Table
              dataSource={dataSourceWithKeys}
              columns={bestsaller_columns}
            />
          </div>
        </>
      ) : (
        <>
          <Flex gap="small" vertical>
            <Spin tip="Loading..."></Spin>
          </Flex>
        </>
      )}
    </div>
  );
};

export default ChartProducts;
