import React, { useEffect, useState } from "react";
import { Table, message, Flex, Button, Popconfirm, Form, Input } from "antd";
import {
  PlusSquareOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { ProductServices, OptionServices } from "../../app/store/features";
import { CreateProduct, UpdateProduct } from "../../commons";

const ProductList = () => {
  const dispatch = useDispatch();
  const optionProperties = useSelector(
    (state) => state.optionReducer.optionProperties
  );
  const optionRoot = useSelector((state) => state.optionReducer.optionRoot);
  const products = useSelector((state) => state.productReducer.products);
  const loading = useSelector((state) => state.productReducer.loading);
  const error = useSelector((state) => state.productReducer.error);

  const [open, setOpen] = useState(true);
  const [openUpdate, setOpenUpdate] = useState(true);

  useEffect(() => {
    if (optionRoot.length === 0) {
      dispatch(OptionServices.getOptionRoot());
    }
    if (optionProperties.length === 0) {
      dispatch(OptionServices.getOptionProperty());
    }
    if (products.length === 0) {
      dispatch(ProductServices.getListProduct(''));
    }
  }, [dispatch, optionProperties, optionRoot, products]);

  const startEdit = (e) => {
    dispatch(ProductServices.setProductDetail(e));
    setOpenUpdate(false);
    setOpen(true);
  };

  const startrDelete = (e) => {
    dispatch(ProductServices.deleteProduct({ id: e.Id }))
      .unwrap()
      .then((res) => {
        if (res.StatusCode === 200) {
          message.success({
            content: "Delete success",
            duration: 2,
          });
        } else {
          message.error({
            content: "Delete faild " + res.Message,
            duration: 2,
            style: {
              marginTop: "3vh",
            },
          });
        }
      })
      .catch((err) => {
        message.error({
          content: err.Payload.TranslateContext + " : " + err.Message,
          duration: 2,
          style: {
            marginTop: "3vh",
          },
        });
      });
  };

  //#region  modal
  const showCreate = () => {
    setOpen(!open);
    setOpenUpdate(true);
  };

  //#endregion

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Category",
      dataIndex: "Category",
      key: "Category",
    },
    {
      title: "Brand",
      dataIndex: "Brand",
      key: "Brand",
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
    },
    {
      title: "Rate",
      dataIndex: "Rate",
      key: "Rate",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (e) => (
        <>
          <EditOutlined onClick={() => startEdit(e)} className="mx-2" />
          <Popconfirm
            title="Delete the product"
            description="Are you sure to delete this task?"
            onConfirm={() => startrDelete(e)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined className="mx-2" />
          </Popconfirm>
        </>
      ),
    },
  ];

  const columns_variant = [
    {
      title: "SkuId",
      dataIndex: "SkuId",
      key: "SkuId",
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "ImportPrice",
      dataIndex: "ImportPrice",
      key: "ImportPrice",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
    },
  ];

  const onFilter = (e) => {
    var query = ''
    if (e.ProductName)
      query += `&$filter=contains(Name,'${e.ProductName}')`
      dispatch(ProductServices.getListProduct(query));
  }

  const dataSourceWithKeys = products.map((item) => {
    return { ...item, key: item.Id };
  });

  if (!products || loading) {
    return <>LOADDING...</>;
  } else if (error && error.TranslateKey !== "304") {
    return <>FAILD LOAD...</>;
  }

  return (
    <div>
      <div>
        <Flex gap="4px 0" wrap="wrap" align="flex-end" vertical>
          <Flex gap="small" wrap="wrap">
            <Button onClick={() => showCreate()} type="primary">
              <PlusSquareOutlined />
            </Button>
          </Flex>
        </Flex>
      </div>
      {open ? (
        <></>
      ) : (
        <div className="bg-white p-5">
          <CreateProduct />
        </div>
      )}
      {openUpdate ? (
        <></>
      ) : (
        <div className="bg-white p-5">
          <CloseCircleOutlined
            onClick={() => setOpenUpdate(true)}
            className="d-flex justify-content-end inline-block pt-1 text-danger"
          />
          <UpdateProduct />
        </div>
      )}
      <Form onFinish={onFilter} className="row py-3 bg-nav-search">
        <Form.Item
          label={"Tên Sản Phẩm"}
          name={"ProductName"}
          className="col-3"
        >
          <Input />
        </Form.Item>
        <Form.Item className="col-3">
          <Button htmlType="submit">
            <AiOutlineSearch />
          </Button>
        </Form.Item>
      </Form>
      <Table
        className="shadow-lg rounded"
        dataSource={dataSourceWithKeys}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <p
              style={{
                margin: 0,
              }}
            >
              <Table
                columns={columns_variant}
                dataSource={record.ProductVariants}
              />
            </p>
          ),
          rowExpandable: (record) => record.name !== "Not Expandable",
        }}
      />
    </div>
  );
};

export default ProductList;
