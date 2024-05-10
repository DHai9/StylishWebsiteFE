import React from "react";
import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ProductServices } from "../../app/store/features";
import { TextUtilities } from "..";
const { Meta } = Card;

const ProductCart = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickItem = () => {
    if (!product) return;
    if (product.Id) {
      dispatch(ProductServices.setProductDetail(product));
      navigate(`/product/${product.Id}`);
    }
  };

  return (
    <Card
      title={product.Name}
      className="d-inline-block mx-3 my-5"
      hoverable
      style={{ width: 240 }}
      cover={
        <img
          alt={`${product.Name} (${product.Brand})`}
          src={product.ImageUrl}
        />
      }
    >
      <Meta
        className="fw-bolder"
        title={product.name}
        description={`${TextUtilities.numberToMenyStr(product.MinPrice)} - ${TextUtilities.numberToMenyStr(product.MaxPrice)}`}
      />
      {/* Preview Button */}
      <Button
        size="small"
        onClick={() => onClickItem()}
        type="primary"
        style={{ justifyContent: "left", margin: "5px" }}
      >
        Preview
      </Button>
    </Card>
  );
};

export default ProductCart;
