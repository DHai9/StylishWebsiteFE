import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Form,
  Select,
  Pagination,
  Flex,
  Spin,
  Tag,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Chart, Line, Interval, Axis, Tooltip, Legend } from "bizcharts";
import { useDispatch, useSelector } from "react-redux";
import { StatisticalServices } from "../../app/store/features";
import { TextUtilities } from "../../commons";

const ChartBestsaller = () => {
  const dispatch = useDispatch();
  const statisticalOrders = useSelector(
    (state) => state.statisticalReducer.statisticalOrders
  );
  const statisticalOrdersLoadding = useSelector(
    (state) => state.statisticalReducer.loadding
  );
  const statisticalOrdersError = useSelector(
    (state) => state.statisticalReducer.error
  );
  const [data, setData] = useState([]);

  useEffect(() => {
    if (statisticalOrders.length === 0) {
      var options = {
        Month: null,
        Year: null,
        SkuId: null,
      };
      dispatch(StatisticalServices.getProductBestsaller(options));
    }
    setData(statisticalOrders.slice(0, 5));
  }, [
    dispatch,
    statisticalOrders,
    statisticalOrdersError,
    statisticalOrdersLoadding,
  ]);

  const onChange = (page) => {
    page--;
    setData(statisticalOrders.slice(page * 5, page * 5 + 5));
  };

  const onFilter = (el) => {
    let options = {
      Month: el.Month,
      Year: el.Year,
    };
    if (el.Month) options.Month = el.Month;
    if (el.Year) options.Year = el.Year;
    if (el.SkuId) options.SkuId = `'${el.SkuId}'`;
    else options.SkuId = null;

    dispatch(StatisticalServices.getProductBestsaller(options));
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const options = [
    {
      label: "Tháng 1",
      value: 1,
    },
    {
      label: "Tháng 2",
      value: 2,
    },
    {
      label: "Tháng 3",
      value: 3,
    },
    {
      label: "Tháng 4",
      value: 4,
    },
    {
      label: "Tháng 5",
      value: 5,
    },
    {
      label: "Tháng 6",
      value: 6,
    },
    {
      label: "Tháng 7",
      value: 7,
    },
    {
      label: "Tháng 8",
      value: 8,
    },
    {
      label: "Tháng 9",
      value: 9,
    },
    {
      label: "Tháng 10",
      value: 10,
    },
    {
      label: "Tháng 11",
      value: 11,
    },
    {
      label: "Tháng 12",
      value: 12,
    },
  ];

  const bestsaller_variant_columns = [
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

  const columns_orders = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      render: (e) => <Tag>{e}</Tag>,
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      render: (e) => (
        <Tag color="green">{TextUtilities.numberToMenyStr(e)}</Tag>
      ),
    },
    {
      title: "ImportPrice",
      dataIndex: "ImportPrice",
      key: "ImportPrice",
      render: (e) => <Tag color="blue">{TextUtilities.numberToMenyStr(e)}</Tag>,
    },
    {
      title: "Revenue",
      key: "Revenue",
      render: (e) => (
        <Tag color="geekblue">
          {TextUtilities.numberToMenyStr(
            e.Price * e.Quantity - e.ImportPrice * e.Quantity
          )}
        </Tag>
      ),
    },
  ];

  const dataSourceVariantWithKeys = statisticalOrders?.map((item) => {
    return { ...item, key: item.Id };
  });

  if (statisticalOrdersError) {
    return <div>Error: {statisticalOrdersError}</div>;
  }

  return (
    <div className="row">
      <h2 className="d-flex justify-content-center">Sản Phẩm Bán Chạy</h2>
      <div className="col-12 my-5">
        <Form onFinish={onFilter} className="row py-3 bg-nav-search">
          <Form.Item
            label={"Tháng"}
            name={"Month"}
            initialValue={null}
            className="col-3"
          >
            <Select
              showSearch
              placeholder="Select month"
              optionFilterProp="children"
              filterOption={filterOption}
              options={options}
            />
          </Form.Item>
          <Form.Item
            label={"Năm"}
            name={"Year"}
            className="col-3"
            initialValue={null}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={"Mã sản phẩm"}
            name={"SkuId"}
            className="col-3"
            initialValue={null}
          >
            <Input />
          </Form.Item>
          <Form.Item className="col-3">
            <Button htmlType="submit">
              <SearchOutlined />
            </Button>
          </Form.Item>
        </Form>
      </div>

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
          total={Math.ceil(statisticalOrders.length / 5) * 5}
          pageSize={5}
        />
      </div>
      {!statisticalOrdersLoadding ? (
        <>
          <div className="mt-2">
            <Table
              dataSource={dataSourceVariantWithKeys}
              columns={bestsaller_variant_columns}
              expandable={{
                expandedRowRender: (record) => (
                  <p
                    style={{
                      margin: 0,
                    }}
                  >
                    <Table
                      columns={columns_orders}
                      dataSource={record.OrderDetails}
                    />
                  </p>
                ),
                rowExpandable: (record) => record.name !== "Not Expandable",
              }}
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

export default ChartBestsaller;
