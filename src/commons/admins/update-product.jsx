import React, { useState, useEffect } from "react";
import {
  PlusOutlined,
  MinusCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  UploadOutlined,
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
  Image,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  OptionServices,
  ProductServices,
  ProductOptionServices,
} from "../../app/store/features";

const steps = [
  {
    key: "Update-Product",
    title: "Update Product",
  },
  {
    key: "Update-Varients",
    title: "Update-Varients",
  },
];

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const optionProperties = useSelector(
    (state) => state.optionReducer.optionProperties
  );
  const product = useSelector((state) => state.productReducer.product_detail);
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
  const [load, setLoad] = useState(true);
  const [productUpdate, setProductUpdate] = useState();
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    if (optionRoot || optionRoot.length === 0) {
      dispatch(OptionServices.getOptionRoot());
    }
    if (optionProperties || optionProperties.length === 0) {
      dispatch(OptionServices.getOptionProperty());
    }
    if (product) {
      let newpro = { ...product };
      let arr_vv = [];
      newpro?.ProductVariants?.map((x) => {
        let arr_img = [];
        x.Images?.map((i, idx) => {
          let obj = {
            uid: idx,
            name: "",
            status: "done",
            url: i,
            fileUrl: i,
          };
          arr_img.push(obj);
        });
        arr_vv.push({ ...x, ...{ ImagesData: arr_img } });
      });
      newpro.ProductVariants = arr_vv;
      let imageMain = {
        uid: 0,
        name: "",
        status: "done",
        url: newpro.ImageUrl,
        fileUrl: newpro.ImageUrl,
      };
      setImageUrl(newpro.ImageUrl);
      newpro.ImageUrl = [{ ...imageMain }];
      setProductUpdate(newpro);
    }
    setLoad(false);
  }, [dispatch, product]);

  const deleteProductOption = (e) => {
    porductUpdateDeleteOption(e);
    dispatch(ProductOptionServices.deleteProductOption({ id: e.Id }))
      .unwrap()
      .then((res) => {
        if (res.StatusCode === 200) {
          porductUpdateDeleteOption(e);
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

  const porductUpdateDeleteOption = (el) => {
    var newProductUpdate = { ...productUpdate };
    newProductUpdate.ProductVariants?.map(
      (e) =>
        (e.VariantValues = e.VariantValues?.filter(
          (obj) => obj.OptionId != el.OptionId
        ))
    );
    newProductUpdate.ProductOptions = newProductUpdate.ProductOptions?.filter(
      (e) => e.Id != el.Id
    );
    form.setFieldsValue({
      ProductVariants: newProductUpdate.ProductVariants,
      ProductOptions: newProductUpdate.ProductOptions,
    });
  };

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
    values.ProductOptions = [...optionChoise, ...productUpdate.ProductOptions];
    values.Id = productUpdate.Id;
    values.ImageUrl = imageUrl;
    dispatch(ProductServices.updateProduct(values))
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
  };

  const onFinishFailed = (err) => {
    Modal.error({
      title: "Form Submission Failed",
      content: "Please check the form fields and try again.",
    });
  };

  const resForm = () => {
    form.resetFields();
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
      ProductId: product.Id,
      OptionId: el,
      Name: optionSelected.Name,
      OptionValues: optionSelected.OptionValues,
    };
    setOption(obj);
  };

  const addOption = () => {
    var obj = optionChoise.find((el) => el.OptionId === option.OptionId);
    var obj2 = productUpdate.ProductOptions.find(
      (el) => el.OptionId === option.OptionId
    );
    if (!obj && !obj2) {
      setOptionChoise([...optionChoise, option]);
    } else {
      message.warning({
        content: "Item already added!",
        duration: 2,
      });
    }
  };

  const deleteOption = (id) => {
    const arr = optionChoise.filter((el) => el.OptionId !== id);
    setOptionChoise(arr);
  };

  if (loading || !productUpdate || load) {
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
        key={"frm-Update"}
        onReset={resForm()}
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
        initialValues={productUpdate}
        form={form}
      >
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
                  id={`${el.Id}-p`}
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
              <Image width={100} src={imageUrl} />
              {!imageUrl ? (
                <Upload
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  customRequest={uploadImageUrl}
                  beforeUpload={beforeUpload}
                  onRemove={() => setImageUrl(null)}
                >
                  <Button
                    className="bg-primary"
                    style={{
                      border: 0,
                    }}
                    type="button"
                  >
                    <UploadOutlined />
                  </Button>
                </Upload>
              ) : (
                <Button
                  onClick={() => setImageUrl(null)}
                  className="bg-danger"
                  style={{
                    border: 0,
                  }}
                  type="button"
                >
                  <DeleteOutlined />
                </Button>
              )}
            </Form.Item>
          </div>
          <div className="col-4 shadow-sm rounded row">
            <div className="col-9">
              <Form.Item label={"Thuộc Tính"}>
                <Select
                  value={option.Name}
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
                {optionChoise.map((el) => (
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
                {productUpdate &&
                  productUpdate.ProductOptions &&
                  productUpdate.ProductOptions.map((el) => (
                    <Form.Item>
                      <Tag
                        color="geekblue"
                        closeIcon={
                          <CloseCircleOutlined className="text-danger" />
                        }
                        onClose={() => deleteProductOption(el)}
                      >
                        {el.Option.Name}
                      </Tag>
                    </Form.Item>
                  ))}
              </Flex>
            </div>
          </div>
        </div>
        <div hidden={current == 1 ? false : true} className="">
          <Divider orientation="center">Product Variants</Divider>
          <Form.List name="ProductVariants">
            {(productVariants, { add, remove }) => (
              <div className="row row justify-content-between">
                {productVariants.map(
                  (productVariant, key, name, ...restField) => (
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
                          label={"Mã"}
                          name={[productVariant.name, "SkuId"]}
                          {...restField}
                        >
                          <Input disabled placeholder="Sku Id" />
                        </Form.Item>
                        <Form.Item
                          className="col-6"
                          label={"Giá Nhập"}
                          name={[productVariant.name, "ImportPrice"]}
                          rules={[
                            {
                              required: true,
                              message: "Không được để trống",
                            },
                          ]}
                          {...restField}
                        >
                          <InputNumber min={1} placeholder="Giá Nhập" />
                        </Form.Item>
                        <Form.Item
                          className="col-6"
                          {...restField}
                          label={"Giá"}
                          name={[productVariant.name, "Price"]}
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
                          label={"Số Lượng"}
                          name={[productVariant.name, "Quantity"]}
                          rules={[
                            {
                              required: true,
                              message: "Không được để trống",
                            },
                          ]}
                          {...restField}
                        >
                          <InputNumber min={1} placeholder="Số Lượng" />
                        </Form.Item>
                        <Divider />
                        <Form.List
                          name={[productVariant.name, "VariantValues"]}
                          className="col-12"
                        >
                          {/* old value */}
                          {(variantValues) => {
                            if (variantValues.length === 0) {
                              return (
                                <div className="row">
                                  {productUpdate?.ProductOptions.map(
                                    (ProductOption, name) => (
                                      <div className="mx-3 col-4">
                                        <Form.Item
                                          hidden
                                          initialValue={ProductOption.Id}
                                          name={[name, "Id"]}
                                        ></Form.Item>
                                        <Form.Item
                                          hidden
                                          initialValue={ProductOption.ProductId}
                                          name={[name, "ProductId"]}
                                        ></Form.Item>
                                        <Form.Item
                                          hidden
                                          initialValue={
                                            ProductOption.ProductVariantId
                                          }
                                          name={[name, "ProductVariantId"]}
                                        ></Form.Item>
                                        <Form.Item
                                          hidden
                                          initialValue={ProductOption.OptionId}
                                          name={[name, "OptionId"]}
                                        ></Form.Item>
                                        <Form.Item
                                          hidden
                                          initialValue={
                                            ProductOption.ProductOptionId
                                          }
                                          name={[name, "ProductOptionId"]}
                                        ></Form.Item>
                                        <Form.Item
                                          label={ProductOption?.Option?.Name}
                                          name={[name, "ValueId"]}
                                        >
                                          <Select className="">
                                            {ProductOption?.Option?.OptionValues?.map(
                                              (ov) => (
                                                <Select.Option
                                                  key={ov.Id}
                                                  value={ov.id}
                                                >
                                                  {ov.Value}
                                                </Select.Option>
                                              )
                                            )}
                                          </Select>
                                        </Form.Item>
                                      </div>
                                    )
                                  )}
                                  {/* new value */}
                                  {optionChoise &&
                                    optionChoise.map((op, indx) => (
                                      <div className="mx-3 col-4">
                                        <Form.Item
                                          hidden
                                          name={[
                                            indx + variantValues.length,
                                            "Id",
                                          ]}
                                          {...restField}
                                        ></Form.Item>
                                        <Form.Item
                                          hidden
                                          initialValue={op.ProductId}
                                          name={[
                                            indx + variantValues.length,
                                            "ProductId",
                                          ]}
                                        ></Form.Item>
                                        <Form.Item
                                          hidden
                                          initialValue={op.ProductVariantId}
                                          name={[
                                            indx + variantValues.length,
                                            "ProductVariantId",
                                          ]}
                                        ></Form.Item>
                                        <Form.Item
                                          hidden
                                          initialValue={op.OptionId}
                                          name={[
                                            indx + variantValues.length,
                                            "OptionId",
                                          ]}
                                        ></Form.Item>
                                        <Form.Item
                                          hidden
                                          initialValue={op.ProductOptionId}
                                          name={[
                                            indx + variantValues.length,
                                            "ProductOptionId",
                                          ]}
                                        ></Form.Item>
                                        <Form.Item
                                          label={op.Name}
                                          name={[
                                            indx + variantValues.length,
                                            "ValueId",
                                          ]}
                                          rules={[
                                            {
                                              required: true,
                                              message: "Không được để trống",
                                            },
                                          ]}
                                        >
                                          <Select>
                                            {op.OptionValues &&
                                              op.OptionValues?.map((ov) => (
                                                <>
                                                  <Select.Option
                                                    initialValues={ov.Value}
                                                    value={ov.Id}
                                                  >
                                                    {ov.Value}
                                                  </Select.Option>
                                                </>
                                              ))}
                                          </Select>
                                        </Form.Item>
                                      </div>
                                    ))}
                                </div>
                              );
                            }
                            return (
                              <div className="row">
                                {variantValues.map(
                                  (
                                    variantValue,
                                    { key, name, ...restField }
                                  ) => (
                                    <div className="mx-3 col-4">
                                      <Form.Item
                                        hidden
                                        initialValue={[name, "Id"]}
                                        name={[name, "Id"]}
                                        {...restField}
                                      ></Form.Item>
                                      <Form.Item
                                        hidden
                                        initialValue={[name, "ProductId"]}
                                        name={[name, "ProductId"]}
                                        {...restField}
                                      ></Form.Item>
                                      <Form.Item
                                        hidden
                                        initialValue={[
                                          name,
                                          "ProductVariantId",
                                        ]}
                                        name={[name, "ProductVariantId"]}
                                        {...restField}
                                      ></Form.Item>
                                      <Form.Item
                                        hidden
                                        initialValue={[name, "OptionId"]}
                                        name={[name, "OptionId"]}
                                        {...restField}
                                      ></Form.Item>
                                      <Form.Item
                                        hidden
                                        initialValue={[name, "ProductOptionId"]}
                                        name={[name, "ProductOptionId"]}
                                        {...restField}
                                      ></Form.Item>
                                      <Form.Item
                                        label={
                                          productUpdate?.ProductVariants[
                                            productVariant.key
                                          ]?.VariantValues[variantValue.key]
                                            ?.Options?.Name
                                        }
                                        name={[name, "ValueId"]}
                                        {...restField}
                                      >
                                        <Select
                                          className=""
                                          defaultValue={
                                            productUpdate?.ProductVariants[
                                              productVariant.key
                                            ]?.VariantValues[variantValue.key]
                                              ?.OptionValues?.Id
                                          }
                                        >
                                          {productUpdate?.ProductVariants[
                                            productVariant.key
                                          ]?.VariantValues[
                                            variantValue.key
                                          ]?.Options?.OptionValues?.map(
                                            (ov) => (
                                              <Select.Option
                                                key={ov.Id}
                                                value={ov.id}
                                              >
                                                {ov.Value}
                                              </Select.Option>
                                            )
                                          )}
                                        </Select>
                                      </Form.Item>
                                    </div>
                                  )
                                )}
                                {/* new value */}
                                {optionChoise &&
                                  optionChoise.map((op, indx) => (
                                    <div className="mx-3 col-4">
                                      <Form.Item
                                        hidden
                                        name={[
                                          indx + variantValues.length,
                                          "Id",
                                        ]}
                                        {...restField}
                                      ></Form.Item>
                                      <Form.Item
                                        hidden
                                        initialValue={op.ProductId}
                                        name={[
                                          indx + variantValues.length,
                                          "ProductId",
                                        ]}
                                      ></Form.Item>
                                      <Form.Item
                                        hidden
                                        initialValue={op.ProductVariantId}
                                        name={[
                                          indx + variantValues.length,
                                          "ProductVariantId",
                                        ]}
                                      ></Form.Item>
                                      <Form.Item
                                        hidden
                                        initialValue={op.OptionId}
                                        name={[
                                          indx + variantValues.length,
                                          "OptionId",
                                        ]}
                                      ></Form.Item>
                                      <Form.Item
                                        hidden
                                        initialValue={op.ProductOptionId}
                                        name={[
                                          indx + variantValues.length,
                                          "ProductOptionId",
                                        ]}
                                      ></Form.Item>
                                      <Form.Item
                                        label={op.Name}
                                        name={[
                                          indx + variantValues.length,
                                          "ValueId",
                                        ]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "Không được để trống",
                                          },
                                        ]}
                                      >
                                        <Select>
                                          {op.OptionValues &&
                                            op.OptionValues?.map((ov) => (
                                              <>
                                                <Select.Option
                                                  initialValues={ov.Value}
                                                  value={ov.Id}
                                                >
                                                  {ov.Value}
                                                </Select.Option>
                                              </>
                                            ))}
                                        </Select>
                                      </Form.Item>
                                    </div>
                                  ))}
                              </div>
                            );
                          }}
                        </Form.List>
                        <Divider />
                        <div className="col-12">
                          <Form.Item
                            {...restField}
                            name={[productVariant.name, "ImagesData"]}
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
                  )
                )}
                <Divider>
                  <Button onClick={() => add()} block icon={<PlusOutlined />}>
                    Add
                  </Button>
                </Divider>
              </div>
            )}
          </Form.List>
        </div>
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
          )}{" "}
          {current === steps.length - 1 && (
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          )}
        </Divider>
      </Form>
      <div style={contentStyle}>{steps[current].content}</div>
    </div>
  );
};

export default UpdateProduct;
