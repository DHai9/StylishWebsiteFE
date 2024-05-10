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
import {
  Chart,
  Line,
  Interval,
  Axis,
  Tooltip,
  Legend,
  Geom,
  Coordinate,
  getTheme,
} from "bizcharts";
import { useDispatch, useSelector } from "react-redux";
import { StatisticalServices } from "../../app/store/features";
import { TextUtilities } from "../../commons";

const UserOrderChart = () => {
  const dispatch = useDispatch();
  const statisticalUser = useSelector(
    (state) => state.statisticalReducer.statisticalUser
  );
  const loadding = useSelector((state) => state.statisticalReducer.loadding);
  const error = useSelector((state) => state.statisticalReducer.error);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);

  const theme = getTheme();
  const colors = theme.colors10;

  useEffect(() => {
    if (statisticalUser.length === 0) {
      dispatch(StatisticalServices.getUserStatistical(""));
    }
    setData(statisticalUser.slice(currentPage - 1, currentPage + 10));
  }, [dispatch, statisticalUser, error, loadding]);

  const onChange = (page) => {
    setCurrentPage(page);
    setData(statisticalUser.slice(page - 1, page + 10));
  };

  const onFilter = (el) => {
    let options = {
      Month: el.Month,
      Year: el.Year,
    };
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
      title: "Tên khách hàng",
      dataIndex: "UserName",
      key: "UserName",
    },
    {
      title: "Số đơn",
      dataIndex: "CountOrder",
      key: "CountOrder",
    },
    {
      title: "Tổng tiền",
      dataIndex: "SumMoney",
      key: "SumMoney",
      render: (e) => TextUtilities.numberToMenyStr(e),
    },
  ];

  const dataSourceVariantWithKeys = statisticalUser?.map((item) => {
    return { ...item, key: item.Id };
  });

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="row">
      <h2 className="d-flex justify-content-center">Top khách hàng</h2>
      <div className="col-12 my-5">
        <Form onFinish={onFilter} className="row py-3 bg-nav-search">
          <Form.Item
            label={"Tháng"}
            name={"Month"}
            className="col-3"
            rules={[
              {
                required: true,
                message: "Không được để trống",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Chọn tháng"
              optionFilterProp="children"
              filterOption={filterOption}
              options={options}
            />
          </Form.Item>
          <Form.Item
            label={"Năm"}
            name={"Year"}
            className="col-3"
            rules={[
              {
                required: true,
                message: "Không được để trống",
              },
            ]}
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
          <Axis name="UserName" />
          <Axis name="SumMoney" />
          <Axis name="CountOrder" />
          <Tooltip shared />
          <Line position="UserName*CountOrder" color="red" />
          <Line position="UserName*SumMoney" color="blue" />
        </Chart>
      </div>
      <div className="my-2 col-6 shadow-lg rounded">
        <Chart height={400} data={data} autoFit appendPadding={[20, 0]}>
          <Tooltip shared />
          <Axis name="UserName" />
          <Axis name="SumMoney" position="left" />
          <Axis name="CountOrder" position="right" />
          <Interval
            position="UserName*SumMoney*CountOrder"
            adjust={[
              {
                type: "dodge",
              },
            ]}
            size={10}
            color={"blue"}
            label={[
              "CountOrder",
              (val) => {
                return {
                  content: val,
                  style: {
                    fill: "red",
                    fontSize: 10,
                  },
                };
              },
            ]}
          />
        </Chart>
      </div>
      <div className="d-flex justify-content-center">
        <Pagination
          size="small"
          onChange={onChange}
          className="mt-5"
          total={Math.ceil(statisticalUser.length / 10) * 10}
          pageSize={10}
        />
      </div>
      {!loadding ? (
        <>
          <div className="mt-2">
            <Table
              dataSource={dataSourceVariantWithKeys}
              columns={bestsaller_variant_columns}
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

export default UserOrderChart;
