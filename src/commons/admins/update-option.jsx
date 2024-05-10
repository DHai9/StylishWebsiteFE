import React, { useEffect } from "react";
import {
  Button,
  Divider,
  Form,
  Input,
  Space,
  message,
  Spin,
  Radio,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { OptionServices } from "../../app/store/features";

const UpdateOption = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const option_update = useSelector(
    (state) => state.optionReducer.option_update
  );
  const loading = useSelector((state) => state.optionReducer.loading);
  const error = useSelector((state) => state.optionReducer.error);

  useEffect(() => {
    form.resetFields();
  }, [option_update]);

  const onFinish = (e) => {
    dispatch(OptionServices.updateOption(e))
      .unwrap()
      .then((res) => {
        if (res.StatusCode === 200) {
          message.success({
            content: `Update option ${option_update.Name} success`,
            duration: 2,
          });
          form.resetFields();
        } else {
          message.error({
            content: "Thao tác thất bại: " + res.Message,
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

  if (loading || !option_update) {
    return (
      <>
        <Spin tip="Loading" size="small">
          <div className="content" />
        </Spin>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Spin tip="Loading" size="small">
          <div className="content" />
        </Spin>
      </>
    );
  }

  return (
    <>
      <Form
        initialValues={option_update}
        form={form}
        onFinish={onFinish}
        className="shadow-lg rounded p-5 row"
      >
        <Divider>
          Update Option: <b className="text-danger">{option_update.Name}</b>
        </Divider>
        <div className="col-3">
          <Form.Item hidden name={"Id"}></Form.Item>
          <Form.Item
            label={"Tên"}
            name={"Name"}
            rules={[
              {
                required: true,
                message: "Không được để trống",
              },
            ]}
          >
            <Input placeholder="Tên thuộc tính" />
          </Form.Item>
          <Form.Item
            label={"Loại"}
            name={"OptionType"}
            rules={[
              {
                required: true,
                message: "Không được để trống",
              },
            ]}
          >
            <Radio.Group>
              <Radio value={0}> Root </Radio>
              <Radio value={1}> Nomal </Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <div className="col-9 row">
          <Form.List className="" name={"OptionValues"}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                    className="col-3 inline-block"
                  >
                    <Form.Item {...restField} name={[name, "Id"]}></Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "OptionId"]}
                    ></Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "Value"]}
                      rules={[
                        { required: true, message: "Không được để trống" },
                      ]}
                    >
                      <Input placeholder="Giá trị" />
                    </Form.Item>
                    {option_update.OptionValues.length <= key ? (
                      <MinusCircleOutlined
                        className="text-danger"
                        onClick={() => remove(name)}
                      />
                    ) : (
                      <></>
                    )}
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
        <Divider />
        <Form.Item className="d-flex justify-content-center">
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default UpdateOption;
