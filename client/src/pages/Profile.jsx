import { Field, Form, ErrorMessage, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import AuthContext from "../contexts/AuthContext/AuthContext";
import kiotAPI from "../apis/kiotAPI";
import accountAPI from "../apis/accountAPI";
import {
  kiotProfileModalFormItems,
  passwordProfileModal,
  profileModalFormItems,
} from "../global/profileModalFormItems";
import ModalFormItem from "../global/ModalFormItem";

function Profile() {
  const [loading, setLoading] = useState(false);
  const { auth, handleLogin } = useContext(AuthContext);
  const [kiot, setKiot] = useState();
  const [actionStatus, setActionStatus] = useState();
  const dismissAlert = () => setActionStatus();
  const [selectedFile, setSelectedFile] = useState(null);
  const getKiotInfo = async (actionSt) => {
    setTimeoutAlert(actionSt);
    try {
      const response = await kiotAPI.getById(auth.user.kiot_id);
      setKiot(response.data.data.kiotInfo);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("currentUrl", window.location.pathname);
    getKiotInfo(actionStatus);
  }, []);
  const initialValues = {
    fullName: auth.user.fullName,
    phone: auth.user.phone,
    email: auth.user.email,
    address: auth.user.address,
    kiotName: kiot && kiot.fullName,
    kiotPhone: kiot && kiot.phone,
    kiotAddress: kiot && kiot.address,
    kiotEmail: kiot && kiot.email,
    description: kiot && kiot.describe,
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string(),
    phone: Yup.string().required("Phone is required"),
    address: Yup.string().required("Address is required"),
    password: Yup.string()
      .concat(false ? Yup.string().required("Password is required") : null)
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .when("password", (password, schema) => {
        if (false) return schema.required("Confirm Password is required");
      })
      .oneOf([Yup.ref("password")], "Passwords must match"),
    kiotName: Yup.string().required("Kiot Name is required"),
    description: Yup.string(),
  });
  
  function onSubmit(fields, { setStatus, setSubmitting, resetForm }) {
    setStatus();
    const userInfo = {
      userId: auth.user._id,
      address: fields.address,
      fullName: fields.fullName,
      email: fields.email,
      phone: fields.phone,
      address: fields.address,
      password: fields.password,
      active: auth.user.active
    };
    updateAccount(userInfo);

    const kiotInfo = {
      kiot_id: auth.user.kiot_id,
      fullName: fields.kiotName,
      phone: fields.kiotPhone,
      email: fields.kiotEmail,
      address: fields.kiotAddress,
      describe: fields.description,
    };
    updateKiot(kiotInfo);
    getKiotInfo({
      status: 1,
      message: "Profile is updated successfully!",
    });
  }
  const setTimeoutAlert = (actionSt) => {
    if (actionSt) {
      setActionStatus(actionSt);
      setTimeout(() => {
        setActionStatus();
      }, 5000);
    }
  };
  async function updateAccount(fields, setSubmitting) {
    await accountAPI
      .update(fields)
      .then(() => {})
      .catch((error) => {
        // setSubmitting(false);
        console.log(error.response.data.message);
      });
  }

  async function updateKiot(fields, setSubmitting) {
    await kiotAPI
      .update(fields)
      .then(() => {})
      .catch((error) => {
        // setSubmitting(false);
        console.log(error.response.data.message);
      });
  }

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      // Make the API request to upload the file
      await accountAPI.uploadAvatar(formData);
      getKiotInfo();
      handleLogin();
      setSelectedFile();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleClose = () => {};
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting, setFieldValue }) => {
        return (
          <Form className="container rounded bg-white m-4 profile-form">
            {actionStatus && (
              <div
                class={
                  actionStatus.status === 1
                    ? "alert alert-success alert-dismissible"
                    : "alert alert-danger alert-dismissible"
                }
              >
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="alert"
                  onClick={dismissAlert}
                ></button>

                <strong>{actionStatus.message}</strong>
              </div>
            )}
            <div className="row">
              <div className="col-md-3 border-right">
                <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                  <img
                    className="rounded-circle mt-5"
                    width="150px"
                    src={
                      auth.user?.avatarUrl ||
                      "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                    }
                  />
                  <span className="fw-bold">{auth.user.username}</span>
                  {loading && (
                    <p className="text-info mt-3">
                      Upload avatar in progress...
                    </p>
                  )}
                  <div class="mb-3 mt-3">
                    <input
                      class="form-control"
                      type="file"
                      id="formFile"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <button
                      className="btn btn-primary mt-3"
                      type="button"
                      onClick={handleUpload}
                    >
                      Upload avatar
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-5 border-right">
                <div className="p-3 py-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="text-right">Profile Settings</h4>
                  </div>
                  {profileModalFormItems.map((item) => (
                    <ModalFormItem
                      item={item}
                      errors={errors}
                      touched={touched}
                    />
                  ))}

                  <div>
                    <h3 className="pt-3 fs-6 fw-bold">Change Password</h3>
                    <p>Leave blank to keep the same password</p>
                  </div>
                  {passwordProfileModal.map((item) => (
                    <ModalFormItem
                      item={item}
                      errors={errors}
                      touched={touched}
                    />
                  ))}
                  <div className="mt-5 text-center">
                    <button
                      className="btn btn-primary profile-button"
                      type="submit"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              </div>
              {auth.user.role_id !== 1 && (
                <div className="col-md-4">
                  <div className="p-3 py-5 mt-3">
                    <span className="fs-6 fw-bold px-3 p-1 add-experience">
                      Kiot Information
                    </span>
                    {kiotProfileModalFormItems.map((item) => (
                      <ModalFormItem
                        item={item}
                        errors={errors}
                        touched={touched}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default Profile;
