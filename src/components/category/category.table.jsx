import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { notification, Popconfirm, Space, Table, Tag } from "antd";
import { useState } from "react";
import CategoryDetailComponent from "./category.detail";
import CategoryUpdateFormComponent from "./category.update.form";
import { deleteCategoryAPI } from "../../services/api.service.category";

const CategoryTableComponent = (props) => {
  const [openDraw, setOpenDraw] = useState(false);
  const [dataDetail, setDataDetail] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const {
    data,
    current,
    setCurrent,
    pageSize,
    setPageSize,
    total,
    loading,
    fetchCategory,
  } = props;
  const deleteCategory = async (id) => {
    const res = await deleteCategoryAPI(id);
    if (res && res.data) {
      notification.success({
        message: "Xóa thành công",
        description: "Xóa danh mục thành công",
      });
      fetchCategory();
    } else {
      notification.error({
        message: "Xóa thất bại",
        description: `Xóa danh mục thất bại`,
      });
    }
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "5%",
      align: "center",
      responsive: ["md"],
      render: (_, record, index) => {
        return <>{index + 1 + (current - 1) * pageSize}</>;
      },
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      width: "25%",
      align: "center",

      render: (value, record) => {
        return (
          <a
            className="text-blue-500"
            onClick={() => {
              setDataDetail(record);
              setOpenDraw(true);
            }}
          >
            {value}
          </a>
        );
      },
    },

    {
      title: "Danh mục cha",
      key: "parent",
      dataIndex: "parent",
      responsive: ["lg"],
      width: "25%",
      align: "center",
      render: (_, values) => {
        return (
          <>{values.parent ? values.parent.name : "Không có danh mục cha"}</>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      responsive: ["sm"],
      width: "10%",
      align: "center",
      render: (_, { status }) => {
        let color = status === "inactive" ? "volcano" : "green";
        let value =
          status === "inactive"
            ? (status = "Ngưng hoạt động")
            : (status = "Hoạt động");
        return (
          <>
            <Tag color={color} key={status}>
              {value.toUpperCase()}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: "10%",
      align: "center",

      render: (_, record) => (
        <Space size="middle">
          <div style={{ display: "flex", gap: "30px" }}>
            <EditOutlined
              className="text-lg"
              style={{ cursor: "pointer", color: "orange" }}
              onClick={() => {
                if (record) {
                  setDataDetail(record);
                  setIsModalUpdateOpen(true);
                }
              }}
            />
            <Popconfirm
              className="text-lg"
              title="Confirm delete"
              description="Chắc chắn xóa user này"
              onConfirm={() => {
                deleteCategory(record._id);
              }}
              okText="Có"
              cancelText="không"
              placement="left"
            >
              <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
            </Popconfirm>
          </div>
        </Space>
      ),
    },
  ];
  const onChange = (pagination) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
  };
  return (
    <>
      <Table
        loading={loading}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px",
        }}
        rowKey={"_id"}
        className="rounded-t-3xl rounded-b-2xl"
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={{
          position: ["bottomCenter"],
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          pageSizeOptions: ["5", "10", "20", "30"],
          showTotal: (total, range) => {
            return (
              <div>
                {" "}
                {range[0]}-{range[1]} trên {total} hàng
              </div>
            );
          },
        }}
      />
      <CategoryDetailComponent
        openDraw={openDraw}
        setOpenDraw={setOpenDraw}
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
      />
      <CategoryUpdateFormComponent
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        fetchCategory={fetchCategory}
      />
    </>
  );
};

export default CategoryTableComponent;
