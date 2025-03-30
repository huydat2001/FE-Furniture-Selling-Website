import { Button, Result } from "antd";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";

const PrivateRoute = (props) => {
  const { user } = useContext(AuthContext);
  if (user && user._id) {
    return <>{props.children}</>;
  }
  return (
    <>
      <Result
        status="403"
        title="Oops"
        subTitle="Bạn cần đăng nhập"
        extra={
          <Button type="primary">
            <Link to="/login">Đăng nhập</Link>
          </Button>
        }
      />
    </>
  );
};
export default PrivateRoute;
