import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, Flex, Spin } from "antd";
import { ProductServices } from "../../app/store/features";
import ProductCard from "./product-cart";
import PropType from "prop-types";

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productReducer.products);
  const loadding = useSelector((state) => state.productReducer.loadding);
  const error = useSelector((state) => state.productReducer.error);
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    if (products.length === 0) {
      dispatch(ProductServices.getListProduct(''));
    }
  }, [dispatch, products]);

  const onChange = (page) => {
    setCurrentPage(page - 1);
  };
  if (loadding) {
    return (
      <Flex gap="small" vertical>
        <Spin tip="Loading..."></Spin>
      </Flex>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <>
      {products &&
        products
          .slice(currentPage * 16, currentPage * 16 + 16)
          .map((product) => (
            <ProductCard
              key={`product-slide-${product.Id}`}
              product={product}
            />
          ))}
      <Pagination
        size="small"
        onChange={onChange}
        className="mt-5"
        defaultCurrent={1}
        total={Math.ceil(products.length / 16) * 16}
        pageSize={16}
      />
    </>
  );
};

ProductList.prototype = {
  products: PropType.array.isRequired,
  size: PropType.number,
};

export default ProductList;
