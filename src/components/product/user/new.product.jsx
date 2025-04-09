import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Col, notification, Rate, Row, Tag } from "antd";
import Meta from "antd/es/card/Meta";
import { getProductByQuyeryAPI } from "../../../services/api.service.product";
import { useEffect, useState } from "react";
import ProductListComponent from "./product.list";

const NewProductComponent = () => {
  const filter = {
    populate: "category,discounts",
  };

  return (
    <ProductListComponent filter={filter} badgeText="Mới" badgeColor="green" />
  );
};
export default NewProductComponent;
