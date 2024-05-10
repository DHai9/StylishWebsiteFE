import React, { useState, useEffect } from "react";
import sha1 from "js-sha1";
import {
  PlusOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Upload,
  Select,
  Spin,
  Tag,
  Flex,
  message,
  Steps,
  theme,
  Space,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { OptionServices, ProductServices } from "../../app/store/features";

const steps = [
  {
    key: "Create-Product",
    title: "Create Product",
  },
  {
    key: "Create-Varients",
    title: "Create-Varients",
  },
];

const CreateProduct = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const optionProperties = useSelector(
    (state) => state.optionReducer.optionProperties
  );
  const optionRoot = useSelector((state) => state.optionReducer.optionRoot);
  const loading = useSelector((state) => state.optionReducer.loading);
  const error = useSelector((state) => state.optionReducer.error);
  const [optionChoise, setOptionChoise] = useState([]);
  const [option, setOption] = useState({
    Name: "",
    OptionId: null,
  });
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [imageUrl, setImageUrl] = useState();
  const [signature, setSignature] = useState(null);

  const api_secret = "PDbicIrs0UonA1mez-WNX3FZ0Xw";
  const params_to_sign = {
    timestamp: Math.floor(new Date().getTime() / 1000), // Unix timestamp in seconds
    upload_preset: "ky4yflfw", // Your upload preset name
    folder: "Products", // Optional: Set a folder name
  };
  useEffect(() => {
    if (optionRoot.length === 0) {
      dispatch(OptionServices.getOptionRoot());
    }
    if (optionProperties.length === 0) {
      dispatch(OptionServices.getOptionProperty());
    }
    if (signature === null) {
      setSignature(generateSignature());
    }
  }, [dispatch,optionRoot,optionProperties]);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const contentStyle = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  /* form */
  const onFinish = (values) => {
    values.ProductVariants.map((pv) => {
      pv.Images = pv.ImagesData.map((el) => el.fileUrl);
    });
    values.ProductOptions = optionChoise;
    values.ImageUrl = imageUrl;
    dispatch(ProductServices.addNewProduct(values))
      .unwrap()
      .then((res) => {
        if (res.StatusCode === 200) {
          setCurrent(1);
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
    dispatch(ProductServices.getListProduct(''));
  };

  const onFinishFailed = (err) => {
    Modal.error({
      title: "Form Submission Failed",
      content: "Please check the form fields and try again.",
    });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const uploadFile = (options) => {
    const { onSuccess, onError, file } = options;
    if (file) {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ky4yflfw");
      dispatch(ProductServices.addImageProduct(formData))
        .unwrap()
        .then(async (res) => {
          if (res.status == 200) {
            file.fileUrl = res.data.secure_url;
            onSuccess(res.data.secure_url);
          } else {
            file.fileUrl = "";
            onError();
          }
        });
    }
  };

  const generateSignature = () => {
    // Concatenate the parameters to sign into a string
    const sign_string = Object.keys(params_to_sign)
      .sort()
      .map((key) => `${key}=${params_to_sign[key]}`)
      .join("&");
    // Use js-sha1 to create the SHA1 hash
    const signature = sha1(sign_string + api_secret);
    return signature;
  };

  const uploadImageUrl = (options) => {
    if (imageUrl) {
      message.warning({
        content: "Main Image is only one image",
        duration: 2,
      });
      return;
    }
    const { onSuccess, onError, file } = options;
    if (file) {
      let formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ky4yflfw");
      // formData.append("signature", signature);
      dispatch(ProductServices.addImageProduct(formData))
        .unwrap()
        .then(async (res) => {
          if (res.status == 200) {
            let secure_url = res.data.secure_url;
            setImageUrl(secure_url);
            file.fileUrl = secure_url;
            onSuccess(secure_url);
          } else {
            file.fileUrl = "";
            onError();
          }
        });
    }
  };

  const beforeUpload = (file) => {
    if (imageUrl) {
      message.warning({
        content: "Main Image is only one image",
        duration: 2,
      });
      return Upload.LIST_IGNORE;
    }
  };

  /* option select */
  const selectOption = (el) => {
    var optionSelected = optionProperties.find((o) => o.Id === el);
    var obj = {
      OptionId: el,
      Name: optionSelected.Name,
      OptionValues: optionSelected.OptionValues,
    };
    setOption(obj);
  };

  const addOption = () => {
    var obj = optionChoise.find((el) => el.OptionId === option.OptionId);
    if (!obj) {
      setOptionChoise([...optionChoise, option]);
    }
  };

  const deleteOption = (id) => {
    const arr = optionChoise.filter((el) => el.OptionId !== id);
    setOptionChoise(arr);
  };

  if (loading) {
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
    <div className="row shadow-lg rounded">
      <Steps className="my-5" current={current} items={steps} />{" "}
      <Form
        form={form}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 18,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{
          maxWidth: "100%",
        }}
      >
        {/* STEP 1 */}
        <div hidden={current == 0 ? false : true} className="row">
          <Divider orientation="center">Product</Divider>
          <div className="col-4">
            <Form.Item
              label="Tên Sản Phẩm"
              name="Name"
              rules={[
                {
                  required: true,
                  message: "Không được để trống",
                },
              ]}
            >
              <Input className="shadow rounded" />
            </Form.Item>
            <Form.Item
              label="Mô Tả"
              name="Description"
              rules={[
                {
                  required: true,
                  message: "Không được để trống",
                },
              ]}
            >
              <Input className="shadow rounded" />
            </Form.Item>
            <Form.Item
              label="Mô Tả Ngắn"
              name="ShortDescription"
              rules={[
                {
                  required: true,
                  message: "Không được để trống",
                },
              ]}
            >
              <Input className="shadow rounded" />
            </Form.Item>
          </div>
          <div className="col-4">
            {optionRoot &&
              optionRoot?.map((el) => (
                <Form.Item
                  label={el.Name}
                  name={el.Name}
                  rules={[
                    {
                      required: true,
                      message: "Không được để trống",
                    },
                  ]}
                >
                  <Select className="shadow rounded">
                    {el.OptionValues.map((ov) => (
                      <Select.Option value={ov.Value}>{ov.Value}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              ))}
            <Form.Item label={"Ảnh Chính"} name={"ImageUrl"}>
              <Upload
                customRequest={uploadImageUrl}
                beforeUpload={beforeUpload}
                onRemove={() => setImageUrl(null)}
                multiple
                listType="picture-card"
              >
                <button
                  style={{
                    border: 0,
                    background: "none",
                  }}
                  type="button"
                >
                  <PlusOutlined />
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Add Images
                  </div>
                </button>
              </Upload>
            </Form.Item>
          </div>
          <div className="col-4 shadow-sm rounded row">
            <div className="col-9">
              <Form.Item label={"Thuộc Tính"}>
                <Select
                  value={option.Option}
                  onChange={(el) => {
                    selectOption(el);
                  }}
                >
                  {optionProperties &&
                    optionProperties?.map((el) => (
                      <>
                        <Select.Option value={el.Id}>{el.Name}</Select.Option>
                      </>
                    ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-3">
              <Button type="primary" onClick={() => addOption()}>
                Add
              </Button>
            </div>
            <Divider />
            <div className="col-12">
              <Flex gap="4px 0" wrap="wrap">
                {optionChoise.map((el, index) => (
                  <Form.Item>
                    <Tag
                      color="geekblue"
                      closeIcon={
                        <CloseCircleOutlined className="text-danger" />
                      }
                      onClose={() => deleteOption(el.OptionId)}
                    >
                      {el.Name}
                    </Tag>
                  </Form.Item>
                ))}
              </Flex>
            </div>
          </div>
        </div>
        {/* STEP 2 */}
        <div hidden={current == 1 ? false : true} className="">
          <Divider orientation="center">Product Variants</Divider>
          <Form.List name="ProductVariants">
            {(fields, { add, remove }) => (
              <div className="row row justify-content-between">
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    className="col-xl-5 shadow rounded mx-5 mb-5"
                    key={key}
                    style={{
                      marginBottom: 8,
                    }}
                    align="baseline"
                  >
                    <Divider>
                      <MinusCircleOutlined
                        className="text-danger"
                        onClick={() => remove(name)}
                      />
                    </Divider>
                    <div className="row">
                      <Form.Item
                        className="col-6"
                        {...restField}
                        label={"Giá Nhập"}
                        name={[name, "ImportPrice"]}
                        rules={[
                          {
                            required: true,
                            message: "Không được để trống",
                          },
                        ]}
                      >
                        <InputNumber min={1} placeholder="Giá nhập" />
                      </Form.Item>
                      <Form.Item
                        className="col-6"
                        {...restField}
                        label={"Giá"}
                        name={[name, "Price"]}
                        rules={[
                          {
                            required: true,
                            message: "Không được để trống",
                          },
                        ]}
                      >
                        <InputNumber min={1} placeholder="Giá" />
                      </Form.Item>
                      <Form.Item
                        className="col-6"
                        {...restField}
                        label={"Số Lượng"}
                        name={[name, "Quantity"]}
                        rules={[
                          {
                            required: true,
                            message: "Không được để trống",
                          },
                        ]}
                      >
                        <InputNumber min={1} placeholder="Số lượng" />
                      </Form.Item>
                      <Divider />
                      <Form.List
                        name={[name, "VariantValues"]}
                        className="col-12"
                      >
                        {(subFields, subOpt) => (
                          <div className="d-flex">
                            {optionChoise &&
                              optionChoise.map((op, indx) => (
                                <div className="mx-3">
                                  <Form.Item
                                    hidden
                                    initialValue={op.OptionId}
                                    name={[indx, "OptionId"]}
                                  ></Form.Item>
                                  <Form.Item
                                    label={op.Name}
                                    name={[indx, "ValueId"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "Không được để trống",
                                      },
                                    ]}
                                  >
                                    <Select className="">
                                      {op.OptionValues &&
                                        op.OptionValues?.map((ov) => (
                                          <>
                                            <Select.Option value={ov.Id}>
                                              {ov.Value}
                                            </Select.Option>
                                          </>
                                        ))}
                                    </Select>
                                  </Form.Item>
                                </div>
                              ))}
                          </div>
                        )}
                      </Form.List>
                      <Divider />
                      <div className="col-12">
                        <Form.Item
                          {...restField}
                          name={[name, "ImagesData"]}
                          valuePropName="fileList"
                          getValueFromEvent={normFile}
                        >
                          <Upload
                            customRequest={uploadFile}
                            beforeUpload={false}
                            maxCount={10}
                            multiple
                            listType="picture-card"
                          >
                            <button
                              style={{
                                border: 0,
                                background: "none",
                              }}
                              type="button"
                            >
                              <PlusOutlined />
                              <div
                                style={{
                                  marginTop: 8,
                                }}
                              >
                                Add Images
                              </div>
                            </button>
                          </Upload>
                          {/* <UploadImg /> */}
                        </Form.Item>
                      </div>
                      <Divider />
                    </div>
                  </Space>
                ))}
                <Divider>
                  <Button onClick={() => add()} block icon={<PlusOutlined />}>
                    Add
                  </Button>
                </Divider>
              </div>
            )}
          </Form.List>
        </div>
        {/* CONTROL */}
        <Divider>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          )}
        </Divider>
      </Form>
      <div style={contentStyle}>{steps[current].content}</div>
    </div>
  );
};

export default CreateProduct;
