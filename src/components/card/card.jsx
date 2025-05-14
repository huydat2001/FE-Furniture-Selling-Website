import { Card as AntdCard } from "antd";
import "./styles.css";

export const Card = ({ children, ...others }) => {
  return (
    <AntdCard className="card" {...others}>
      {children}
    </AntdCard>
  );
};
