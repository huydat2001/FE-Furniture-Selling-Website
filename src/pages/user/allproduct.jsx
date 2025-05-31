import React, { useState } from "react";
import ProductListComponent from "../../components/product/user/product.list";
import { Select, Button, Space, Dropdown, Menu } from "antd";
import { FilterOutlined, DownOutlined } from "@ant-design/icons";

const { Option } = Select;

const AllProductpage = () => {
  const [filter, setFilter] = useState({
    populate: "category,discounts",
    status: "active",
  });

  const [priceRange, setPriceRange] = useState("");
  const [rating, setRating] = useState("");
  const [category, setCategory] = useState("");

  const handleFilter = () => {
    const newFilter = {
      ...filter,
      status: "active",
      populate: "category,discounts",
    };
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      newFilter.minPrice = minPrice;
      if (maxPrice) newFilter.maxPrice = maxPrice;
    }
    if (rating) {
      newFilter.rating = Number(rating);
    }
    if (category) {
      newFilter.category = category;
    }
    console.log("New Filter:", newFilter);
    setFilter(newFilter);
  };

  const handleResetFilter = () => {
    setPriceRange("");
    setRating("");
    setCategory("");
    setFilter({
      populate: "category,discounts",
      status: "active",
    });
  };

  const filterMenu = (
    <Menu>
      <Menu.Item key="1">Tùy chọn lọc nâng cao (sắp có)</Menu.Item>
    </Menu>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl my-5 font-semibold">Tất cả sản phẩm</h1>

      <Space wrap className="mb-6">
        <Dropdown overlay={filterMenu}>
          <Button icon={<FilterOutlined />}>
            Bộ lọc <DownOutlined />
          </Button>
        </Dropdown>

        <Select
          placeholder="Giá sản phẩm"
          style={{ width: 200 }}
          onChange={(value) => setPriceRange(value)}
          value={priceRange || undefined}
          allowClear
        >
          <Option value="0-500000">Dưới 500.000 VNĐ</Option>
          <Option value="500000-1000000">500.000 - 1.000.000 VNĐ</Option>
          <Option value="1000000-2000000">1.000.000 - 2.000.000 VNĐ</Option>
          <Option value="2000000-5000000">2.000.000 - 5.000.000 VNĐ</Option>
          <Option value="5000000">Trên 5.000.000 VNĐ</Option>
        </Select>

        <Select
          placeholder="Đánh giá"
          style={{ width: 150 }}
          onChange={(value) => setRating(value)}
          value={rating || undefined}
          allowClear
        >
          <Option value="4.5">4.5 - 5.0 sao</Option>
          <Option value="4">4.0 - 4.5 sao</Option>
          <Option value="3.5">3.5 - 4.0 sao</Option>
          <Option value="3">3.0 - 3.5 sao</Option>
          <Option value="2.5">2.5 - 3.0 sao</Option>
          <Option value="2">2.0 - 2.5 sao</Option>
          <Option value="1.5">1.5 - 2.0 sao</Option>
          <Option value="1">1.0 - 1.5 sao</Option>
        </Select>

        <Select
          placeholder="Danh mục"
          style={{ width: 150 }}
          onChange={(value) => setCategory(value)}
          value={category || undefined}
          allowClear
        >
          <Option value="furniture">Nội thất</Option>
          <Option value="decor">Trang trí</Option>
        </Select>

        <Button type="primary" onClick={handleFilter}>
          Lọc
        </Button>
        <Button onClick={handleResetFilter}>Hiển thị tất cả</Button>
      </Space>

      <ProductListComponent filter={filter} />
    </div>
  );
};

export default AllProductpage;
