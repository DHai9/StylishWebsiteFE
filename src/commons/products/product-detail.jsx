import React, { useState, useEffect } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { HeartOutlined } from "@ant-design/icons";
import { Flex, Rate, Tag, Button, message, InputNumber } from "antd";
import Slider from "react-slick";
import {
  AuthorServices,
  CartServices,
  OrderServices,
} from "../../app/store/features";
import { TextUtilities } from "..";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartReducer.cart);
  const user = useSelector((state) => state.userReducer.user);
  const order_new = useSelector((state) => state.orderReducer.order);
  const productDetail = useSelector(
    (state) => state.productReducer.product_detail
  );
  const loading = useSelector((state) => state.productReducer.loading);
  const error = useSelector((state) => state.productReducer.error);

  console.log(order_new);

  // const [variant, setVariant] = useState(productDetail?.ProductVariants[0]);
  const [variant, setVariant] = useState({});
  const [quantity, setQuantity] = useState(1);

  // Customize settings for the carousel
  var settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
  };

  useEffect(() => {
    if (!user) {
      dispatch(AuthorServices.initUserFromLocal());
    }
    if (!order_new && user !== null) {
      dispatch(OrderServices.getOrderNew(user.Id));
    }
    if (productDetail?.ProductVariants) {
      setVariant(productDetail.ProductVariants[0]);
    }
  }, [productDetail, order_new, user]);

  const addToCart = () => {
    const values = {
      UserId: cart.UserId,
      CartId: cart.Id,
      ProductVariantId: variant.Id,
      ProductName: productDetail.Name,
      ImageUrl: productDetail.ImageUrl,
      Quantity: quantity,
    };
    dispatch(CartServices.addCartItem(values))
      .unwrap()
      .then((res) => {
        if (res.StatusCode === 200) {
          message.success({
            content: "Cập nhật thành công",
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

  const addItemToOrder = () => {
    const item = {
      OrderId: order_new.Id,
      ProductVariantId: variant.Id,
      Quantity: quantity,
      ImportPrice: variant.ImportPrice,
      Price: variant.Price,
      Name: productDetail.Name,
      ImageUrl: productDetail.ImageUrl,
    };
    let payload = {};
    Object.assign(payload, order_new);
    payload.OrderDetails = [...payload.OrderDetails, item];
    dispatch(OrderServices.updateOrder(payload))
      .unwrap()
      .then((res) => {
        if (res.StatusCode === 200) {
          message.success({
            content: "Cập nhật thành công",
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

  const setQuantityChange = (e) => {
    setQuantity(e);
  };

  if (loading || !productDetail) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      {productDetail && variant && (
        <>
          <section className="py-5">
            <div className="container">
              <div className="row gx-5">
                <aside className="col-lg-6">
                  <Slider {...settings}>
                    {variant &&
                      variant?.Images?.map((img) => (
                        <a
                          data-fslightbox="mygalley"
                          className="rounded-4"
                          data-type="image"
                        >
                          <img
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100vh",
                              margin: "auto",
                            }}
                            className="rounded-4 fit"
                            src={img}
                          />
                        </a>
                      ))}
                  </Slider>
                </aside>
                <main className="col-lg-6">
                  <div className="ps-lg-3">
                    <h4 className="title text-dark">
                      {`${productDetail.Name} - ${variant?.SkuId}`}
                    </h4>
                    <div className="d-flex flex-row my-3">
                      <div className="text-warning mb-1 me-2">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fas fa-star-half-alt"></i>

                        <span className="ms-1">
                          <Rate
                            disabled
                            value={productDetail?.Rate}
                            character={<HeartOutlined />}
                            allowHalf
                          />
                        </span>
                      </div>
                      <span className="text-muted">
                        <i className="fas fa-shopping-basket fa-sm mx-1"></i>154
                        orders
                      </span>
                      <span className="text-success ms-2">In stock</span>
                    </div>

                    <div className="mb-3">
                      <span className="h5">
                        {TextUtilities.numberToMenyStr(variant.Price)}
                      </span>
                    </div>
                    <p>{productDetail.ShortDescription}</p>
                    <p>{productDetail.Description}</p>

                    <div className="row">
                      {variant &&
                        variant.VariantValues?.map((el) => {
                          return (
                            <div className="col-6 row">
                              <dt className="col-3">{el.Options.Name}:</dt>
                              <dd className="col-9">{el.OptionValues.Value}</dd>
                            </div>
                          );
                        })}
                    </div>
                    <hr />
                    <Flex gap="4px 0" wrap="wrap">
                      {productDetail &&
                        productDetail?.ProductVariants?.map((vv) => (
                          <Tag onClick={() => setVariant(vv)} color="#2db7f5">
                            {vv.SkuId}
                          </Tag>
                        ))}
                    </Flex>
                    <hr />
                    {variant.Quantity > 0 ? (
                      <>
                        <label htmlFor="quantity">{`Số lượng: ${variant.Quantity}`}</label>
                        <InputNumber
                          title={`Số lượng: ${variant.Quantity}`}
                          value={quantity}
                          id="quantity"
                          onChange={setQuantityChange}
                          min={1}
                          max={variant.Quantity}
                        />
                        <span className="h5 mx-5">Thành Tiền: </span>
                        <span className="h5">
                          {TextUtilities.numberToMenyStr(
                            quantity * variant.Price
                          )}
                        </span>
                      </>
                    ) : (
                      <span className="h5 mx-5 text-danger">Hết Hàng: </span>
                    )}
                    <hr />
                    {order_new !== null ? (
                      <Button
                        onClick={() => addItemToOrder()}
                        className="btn btn-primary shadow-0 mx-2"
                      >
                        Thêm vào hóa đơn mới
                      </Button>
                    ) : (
                      <></>
                    )}
                    <Button
                      onClick={() => addToCart()}
                      className="btn btn-primary shadow-0 mx-2"
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </div>
                </main>
              </div>
            </div>
          </section>
        </>
      )}
    </SkeletonTheme>
  );
};

export default ProductDetail;
