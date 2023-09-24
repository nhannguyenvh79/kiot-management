const accountModalFormItems = [
  {
    label: "Username",
    fieldName: "username",
  },
  {
    label: "Email",
    fieldName: "email",
  },
  {
    label: "Full name",
    fieldName: "fullName",
  },
  {
    label: "Phone",
    fieldName: "phone",
  },
  {
    label: "Address",
    fieldName: "address",
  },
  {
    label: "role",
    fieldName: "role",
    as: "select",
    options: [
      { value: "", name: "" },
      {
        value: "owner",
        name: "Owner",
      },
      {
        value: "employee",
        name: "Employee",
      },
    ],
  },
];

const passwordModal = [
  {
    label: "Password",
    type: "password",
    fieldName: "password",
  },
  {
    label: "Confirm Password",
    type: "password",
    fieldName: "confirmPassword",
  },
];
export { accountModalFormItems, passwordModal };
