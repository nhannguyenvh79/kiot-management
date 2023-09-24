import { FaLock, FaUser } from "react-icons/fa6";

const loginFormItems = [
  {
    label: "Username",
    fieldName: "username",
    fieldIcon: <FaUser/>
  },
  {
    label: "Password",
    fieldName: "userpassword",
    fieldIcon: <FaLock/>,
    type:"password"
  },
];

export { loginFormItems };
