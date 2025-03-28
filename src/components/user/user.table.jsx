import { Popconfirm, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const UserTableComponent = (props) => {
  const {
    dataUser,
    current,
    setCurrent,
    pageSize,
    setPageSize,
    total,
    loading,
  } = props;
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
          pageSizeOptions: ["5", "10", "20", "30"],
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
