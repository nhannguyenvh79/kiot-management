import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext/AuthContext";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { FaRightToBracket } from "react-icons/fa6";
import { Formik, Field, Form, ErrorMessage } from "formik";
import authAPI from "../apis/authAPI";
import { registerFormItems } from "../global/registerFormItems";
import * as Yup from "yup";

const Register = () => {
  useEffect(() => {
    localStorage.setItem("currentUrl", window.location.pathname);
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const logo =
    "https://drive.google.com/uc?export=view&id=1kvFDWul0NlJiF4Pc5fCGAdMqXhWWkUPY";
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    full_name: Yup.string().required("Full Name is required"),
    useremail: Yup.string().email(),
    mo_number: Yup.string().required("Phone is required"),
    address: Yup.string().required("Address is required"),
    userpassword: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    conf_password: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("userpassword")], "Passwords must match"),
  });

  const initialValues = {
    username: "",
    full_name: "",
    useremail: "",
    userpassword: "",
    conf_password: "",
    mo_number: "",
    address: "",
  };
  async function onSubmit(values) {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register({
        username: values.username,
        password: values.userpassword,
        email: values.useremail,
        fullName: values.full_name,
        phone: values.mo_number,
        address: values.address,
        active: false,
      });
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container account-body">
      <div className="row vh-100 ">
        <div className="col-12 align-self-center">
          <div className="auth-page">
            <div className="card auth-card shadow-lg">
              <div className="card-body">
                <div className="px-3">
                  <div className="auth-logo-box">
                    <a
                      href="../dashboard/analytics-index.html"
                      className="logo logo-admin"
                    >
                      <img
                        src={logo}
                        height={55}
                        alt="logo"
                        className="auth-logo"
                      />
                    </a>
                  </div>
                  {/*end auth-logo-box*/}
                  <div className="text-center auth-logo-text">
                    <h4 className="mt-0 mb-3 mt-5">
                      Free Register for Brother
                    </h4>
                    <p className="text-muted mb-0">
                      Get your free Brother account now.
                    </p>
                  </div>{" "}
                  {/*end auth-logo-text*/}
                  <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    {({ errors, touched, isSubmitting, setFieldValue }) => {
                      return (
                        <Form className="form-horizontal auth-form my-4">
                          {registerFormItems.map((item) => {
                            return (
                              <div key={item.fieldName} className="form-group">
                                <label htmlFor={item.fieldName}>
                                  {item.label}
                                </label>
                                <Field
                                  name={item.fieldName}
                                  type={item.type ? item.type : "text"}
                                  placeholder={`Enter ${item.label}`}
                                  className={
                                    "form-control" +
                                    (errors[item.fieldName] &&
                                    touched[item.fieldName]
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name={item.fieldName}
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            );
                          })}
                          {error && <p className="text-danger">{error}</p>}
                          <div className="form-group row mt-4">
                            <div className="col-sm-12">
                              <div className="custom-control custom-switch switch-success">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id="customSwitchSuccess"
                                />
                                <label
                                  className="custom-control-label text-muted"
                                  htmlFor="customSwitchSuccess"
                                >
                                  By registering you agree to the Frogetor{" "}
                                  <a href="#" className="text-primary">
                                    Terms of Use
                                  </a>
                                </label>
                              </div>
                            </div>
                            {/*end col*/}
                          </div>
                          <div className="form-group mb-0 row">
                            <div className="col-12 mt-2">
                              <button
                                className="btn btn-gradient-primary btn-round btn-block waves-effect waves-light"
                                type="submit"
                              >
                                {loading ? "Loading" : "Register"}
                                <FaRightToBracket className="fas fa-sign-in-alt ml-1" />
                              </button>
                            </div>
                            {/*end col*/}
                          </div>{" "}
                        </Form>
                      );
                    }}
                  </Formik>
                </div>

                <div className="m-3 text-center text-muted">
                  <p className>
                    Already have an account ?{" "}
                    <NavLink to="/login" className="text-primary ml-2">
                      Log in
                    </NavLink>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
