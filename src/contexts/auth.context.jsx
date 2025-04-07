import { createContext, useState } from "react";

export const AuthContext = createContext({
  username: "",
  email: "",
  fullName: "",
  role: "",
  id: "",
});
export const AuthWrapper = (props) => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    fullName: "",
    role: "",
    id: "",
  });
  const [isAppLoading, setIsAppLoading] = useState(true);
  return (
    <AuthContext.Provider
      value={{ user, setUser, isAppLoading, setIsAppLoading }}
    >
      {props.children}
      {/* ==<RouterProvider router={router} /> */}
    </AuthContext.Provider>
  );
};
