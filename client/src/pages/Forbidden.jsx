import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Forbidden() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 8000);
  });
  return (
    <div className="container rounded bg-white m-4 profile-form p-4">
      <h1 className="fw-bold">Forbidden</h1>
      <p>You don't have permission to access this resource</p>
      <span>Click </span>
      <Link to="/">here </Link>
      <span>
        to get back to Home Page or it will be navigated automatically
      </span>
    </div>
  );
}

export default Forbidden;
