import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, message, Flex, Button, Tag } from "antd";
import {
  PlusSquareOutlined,
  EditOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { CreateOption, UpdateOption } from "../../commons";
import { OptionServices } from "../../app/store/features";

const OptionList = () => {
  const dispatch = useDispatch();
  const options = useSelector((state) => state.optionReducer.options);
  const loading = useSelector((state) => state.optionReducer.loading);
  const error = useSelector((state) => state.optionReducer.error);

  const [open, setOpen] = useState(true);
  const [openUpdate, setOpenUpdate] = useState(true);

  useEffect(() => {
    if (options.length === 0) {
      dispatch(OptionServices.getListOption());
    }
  }, [options]);

  /* table function */

  const showCreate = () => {
    setOpen(!open);
    setOpenUpdate(true);
  };

  const startEdit = (e) => {
    dispatch(OptionServices.setOptionUpdate(e));
    setOpenUpdate(false);
    setOpen(true);
  };

  const startrDelete = () => {};

  /* table setting */

  const columns = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "OptionType",
      dataIndex: "OptionType",
      key: "OptionType",
      render: (type) => (
        <>
          {type === 0 ? (
            <Tag color="green">Root</Tag>
          ) : (
            <Tag color="geekblue">Nomal</Tag>
          )}
        </>
      ),
    },
    {
      title: "OptionValues",
      dataIndex: "OptionValues",
      key: "OptionValues",
      render: (_, { OptionValues }) => (
        <>
          <Flex gap="4px 0" wrap="wrap">
            {OptionValues.map((e) => {
              return <Tag color="magenta">{e.Value}</Tag>;
            })}
          </Flex>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (e) => (
        <>
          <EditOutlined
            onClick={() => {
              startEdit(e);
            }}
            className="mx-2"
          />
        </>
      ),
    },
  ];

  const dataSourceWithKeys = options.map((item) => {
    return { ...item, key: item.Id };
  });

  /* end table setting */

  if (!options || loading) {
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
          <CreateOption />
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
          <UpdateOption />
        </div>
      )}
      <Table
        className="shadow-lg rounded"
        dataSource={dataSourceWithKeys}
        columns={columns}
      />
    </div>
  );
};

export default OptionList;
