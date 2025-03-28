import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import UserTableComponent from "../components/user/user.table";
import UserFormComponent from "../components/user/user.form";

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
      <UserFormComponent />
      <UserTableComponent />
    </>
  );
};
export default UserPage;
