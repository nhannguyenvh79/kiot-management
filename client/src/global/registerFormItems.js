import {
  FaEnvelope,
  FaLock,
  FaLockOpen,
  FaPhoneFlip,
  FaUser,
} from "react-icons/fa6";

const registerFormItems = [
  {
    label: "Username",
    fieldName: "username",
    fieldIcon: <FaUser />,
  },
  {
    label: "Full Name",
    fieldName: "full_name",
    fieldIcon: <FaUser />,
  },
  {
    label: "Address",
    fieldName: "address",
    fieldIcon: <FaEnvelope />,
  },
  {
    label: "Email",
    fieldName: "useremail",
    fieldIcon: <FaEnvelope />,
    type: "email",
  },
  {
    label: "Mobile Number",
    fieldName: "mo_number",
    fieldIcon: <FaPhoneFlip />,
  },
  {
    label: "Password",
    fieldName: "userpassword",
    fieldIcon: <FaLock />,
    type: "password",
  },
  {
    label: "Confirm Password",
    fieldName: "conf_password",
    fieldIcon: <FaLockOpen />,
    type: "password",
  },
];

export { registerFormItems };
