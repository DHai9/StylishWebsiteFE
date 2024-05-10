import { Button, Divider, Form, Input, Space, message } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { OptionServices } from "../../app/store/features";

const CreateOption = () => {
  const dispatch = useDispatch();
  const onFinish = (e) => {
    dispatch(OptionServices.addNewOption(e))
      .unwrap()
      .then((res) => {
        if (res.StatusCode === 200) {
          message.success({
            content: "Create success",
            duration: 2,
          });
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
  return (
    <>
      <Form onFinish={onFinish} className="shadow-lg rounded p-5 row">
        <Divider>New Option</Divider>
        <div className="col-3">
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
                    <Form.Item
                      {...restField}
                      name={[name, "Value"]}
                      rules={[{ required: true, message: "Không được để trống" }]}
                    >
                      <Input placeholder="Giá trị" />
                    </Form.Item>
                    <MinusCircleOutlined
                      className="text-danger"
                      onClick={() => remove(name)}
                    />
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
            Add
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateOption;
