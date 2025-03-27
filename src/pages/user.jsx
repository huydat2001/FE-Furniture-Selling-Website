import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import UserTableComponent from "../components/user/user.table";

const UserPage = () => {
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
      <UserTableComponent />
    </>
  );
};
export default UserPage;
