import { Popconfirm, Space, Table } from "antd";
import { getAllUserAPI } from "../../services/api.service.user";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const UserTableComponent = () => {
  const [dataUser, setDataUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUser();
  }, [current, pageSize]);
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
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      responsive: ["md"],
      width: "25%",
      align: "center",

      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md"],
      width: "25%",
      align: "center",
    },

    {
      title: "Số điện thoại",
      key: "phone",
      dataIndex: "phone",
      responsive: ["lg"],
      width: "25%",
      align: "center",
    },
    {
      title: "Quyền",
      dataIndex: "role",
      key: "role",
      responsive: ["md"],
      width: "5%",
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      responsive: ["md"],
      width: "10%",
      align: "center",

      render: (_, record) => (
        <Space size="middle">
          <div style={{ display: "flex", gap: "30px" }}>
            <EditOutlined
              style={{ cursor: "pointer", color: "orange" }}
              onClick={() => {
                // setDataUpdate(record);
                // setIsModalUpdateOpen(true);
              }}
            />
            <Popconfirm
              title="Confirm delete"
              description="Chắc chắn xóa user này"
              onConfirm={() => {
                // deleteUser(record._id);
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
  const fetchUser = async () => {
    const res = await getAllUserAPI(current, pageSize);
    if (res.data) {
      setDataUser(res.data.result);
      setTotal(res.data.pagination.total_users);
      setLoading(false);
    }
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
        dataSource={dataUser}
        onChange={onChange}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          total: total,
          showTotal: (total, range) => {
            return (
              <div>
                {" "}
                {range[0]}-{range[1]} trên {total} rows
              </div>
            );
          },
        }}
      />
    </>
  );
};
export default UserTableComponent;
