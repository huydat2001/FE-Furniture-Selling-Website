import { notification, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import UserUpDateFormComponent from "./user.update.form";
import { useState } from "react";
import { deleteUserAPI } from "../../services/api.service.user";
import UserDetailComponent from "./user.detail";

const UserTableComponent = (props) => {
  const [dataUpdate, setDataUpdate] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [openDraw, setOpenDraw] = useState(false);
  const {
    dataUser,
    current,
    setCurrent,
    pageSize,
    setPageSize,
    total,
    loading,
    fetchUser,
  } = props;

  const deleteUser = async (id) => {
    const res = await deleteUserAPI(id);
    if (res && res.data) {
      notification.success({
        message: "Xóa thành công",
        description: "Xóa người dùng thành công",
      });
      fetchUser();
    } else {
      notification.error({
        message: "Xóa thất bại",
        description: `Xóa người dùng thất bại`,
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
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      width: "25%",
      align: "center",

      render: (value, record) => {
        return (
          <a
            className="text-blue-500"
            onClick={() => {
              setUserDetail(record);
              setOpenDraw(true);
            }}
          >
            {value}
          </a>
        );
      },
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
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      responsive: ["md"],
      width: "15%",
      align: "center",
      render: (_, { status }) => {
        let color = status === "banned" ? "volcano" : "green";
        let value =
          status === "banned" ? (status = "Tạm dừng") : (status = "Hoạt động");
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
      title: "Quyền hạn",
      dataIndex: "role",
      key: "role",
      responsive: ["sm"],
      width: "10%",
      align: "center",
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
                  setDataUpdate(record); //
                  setIsModalUpdateOpen(true);
                }
              }}
            />
            <Popconfirm
              className="text-lg"
              title="Confirm delete"
              description="Chắc chắn xóa?"
              onConfirm={() => {
                deleteUser(record._id);
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
        // scroll={{ x: 700 }}
      />
      <UserUpDateFormComponent
        dataUpdate={dataUpdate}
        setdataUpdate={setDataUpdate}
        isModalUpdateOpen={isModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        fetchUser={fetchUser}
      />
      <UserDetailComponent
        openDraw={openDraw}
        setOpenDraw={setOpenDraw}
        userDetail={userDetail}
        setUserDetail={setUserDetail}
      />
    </>
  );
};
export default UserTableComponent;
