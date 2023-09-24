import React, { useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import accountAPI from "../../apis/accountAPI";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  accountModalFormItems,
  passwordModal,
} from "../../global/accountModalFormItems";
import ModalFormItem from "../../global/ModalFormItem";

const AccountModal = ({
  show,
  handleClose,
  onUpdateAccount,
  editedAccount,
  isAddMode,
}) => {
  const [loading, setLoading] = useState(false);
  const initialValues = isAddMode
    ? {
        username: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
        role: "",
      }
    : editedAccount && {
        username: editedAccount.username,
        fullName: editedAccount.fullName,
        email: editedAccount.email,
        phone: editedAccount.phone,
        address: editedAccount.address,
        password: "",
        confirmPassword: "",
        role: editedAccount.role_id === 2 ? "owner" : "employee",
      };
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email(),
    phone: Yup.string().required("Phone is required"),
    address: Yup.string().required("Address is required"),
    role: Yup.string(),
    password: Yup.string()
      .concat(isAddMode ? Yup.string().required("Password is required") : null)
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .when("password", (password, schema) => {
        // if (password || isAddMode)
        if (isAddMode) return schema.required("Confirm Password is required");
      })
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  function onSubmit(fields, { setStatus, setSubmitting, resetForm }) {
    setStatus();
    if (isAddMode) {
      createUser(fields, setSubmitting, resetForm);
      onUpdateAccount();
    } else {
      updateUser(fields, setSubmitting);
      onUpdateAccount();
    }
  }

  async function createUser(fields, setSubmitting, resetForm) {
    resetForm();
    const newUser = {
      ...fields,
      role_id: fields.role === "owner" ? 2 : "employee" && 3,
    };
    setLoading(true);
    await accountAPI
      .create(newUser)
      .then(() => {
        onUpdateAccount({ status: 1, message: "User is added successfully!" });
        handleClose();
      })
      .catch((error) => {
        setSubmitting(false);
        onUpdateAccount({ status: 0, message: error.response.data.error });
        console.log(error);
      })
      .finally(setLoading(false));
  }

  async function updateUser(fields, setSubmitting) {
    const setfields = Object.fromEntries(
      Object.entries(fields).filter(([_, v]) => v != null)
    );
    const updatedFields = {
      ...editedAccount,
      ...setfields,
      userId: editedAccount._id,
    };
    setLoading(true);
    await accountAPI
      .update(updatedFields)
      .then(() => {
        onUpdateAccount({
          status: 1,
          message: "User is editted successfully!",
        });
        handleClose();
      })
      .catch((error) => {
        setSubmitting(false);
        onUpdateAccount({ status: 0, message: error.response.data.error });
      })
      .finally(setLoading(false));
  }

  return (
    <BootstrapModal show={show} onHide={handleClose}>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>
          {editedAccount ? "Edit Account" : "Add Account"}
        </BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        {loading &&
          (editedAccount && editedAccount.fullName ? (
            <p className="text-info">Editting Account ....</p>
          ) : (
            <p className="text-info">Adding Account ....</p>
          ))}

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, isSubmitting, setFieldValue }) => {
            return (
              <Form>
                {accountModalFormItems.map((item) => (
                  <ModalFormItem
                    item={item}
                    isEditMode={!isAddMode && true}
                    errors={errors}
                    touched={touched}
                  />
                ))}

                {!isAddMode && (
                  <div>
                    <h3 className="pt-3">Change Password</h3>
                    <p>Leave blank to keep the same password</p>
                  </div>
                )}

                {passwordModal.map((item) => (
                  <ModalFormItem
                    item={item}
                    errors={errors}
                    touched={touched}
                  />
                ))}

                <div className="form-group text-center">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-secondary me-2"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                  >
                    {isSubmitting && (
                      <span className="spinner-border spinner-border-sm mr-1"></span>
                    )}
                    Save
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};

export default AccountModal;
