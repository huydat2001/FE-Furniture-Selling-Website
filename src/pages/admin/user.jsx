import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import UserTableComponent from "../../components/user/user.table";
import UserFormComponent from "../../components/user/user.form";
import { useEffect, useState } from "react";
import { getAllUserAPI } from "../../services/api.service.user";

const UserPage = () => {
  const [dataUser, setDataUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [current, pageSize]);

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
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <Breadcrumb
        className="mb-6"
        items={[
          {
            title: "Management",
          },
          {
            title: <Link href="#">User</Link>,
          },
        ]}
      />
      <UserFormComponent fetchUser={fetchUser} />
      <UserTableComponent
        dataUser={dataUser}
        current={current}
        setCurrent={setCurrent}
        pageSize={pageSize}
        setPageSize={setPageSize}
        total={total}
        loading={loading}
        fetchUser={fetchUser}
      />
    </>
  );
};
export default UserPage;
