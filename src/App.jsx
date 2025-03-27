import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";

function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
