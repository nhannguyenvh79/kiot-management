import React, { useContext, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { MdOutlineAttachMoney } from "react-icons/md";
import { AiOutlinePoweroff } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import AuthContext from "../../../contexts/AuthContext/AuthContext";

export const priceRange = ["0-10", "10-20", "20-30", "30-40", "40-50", "50"];

const Search = (props) => {
  const { query, setQuery, handleSearch } = props;

  const changeSearchInput = (e) => {
    const newQueryValue = { ...query, search: e.target.value };
    setQuery(newQueryValue);
  };
  const changeRateInput = (e) => {
    const newQueryValue = { ...query, rate: e.target.value };
    setQuery(newQueryValue);
  };
  const changeActiveInput = (e) => {
    const newQueryValue = { ...query, active: e.target.value };
    setQuery(newQueryValue);
  };
  const changeFromDateInput = (e) => {
    const newQueryValue = { ...query, fromdate: e.target.value };
    setQuery(newQueryValue);
  };
  const changeToDateInput = (e) => {
    const newQueryValue = { ...query, todate: e.target.value };
    setQuery(newQueryValue);
  };

  return (
    <form className="search-form m-0 p-0">
      <div className="search-input">
        <label htmlFor="search">
          <BsSearch />
        </label>
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Product name, id,..."
          value={query.search}
          onChange={(e) => changeSearchInput(e)}
        />
      </div>

      <div className="selection-container">
        <label htmlFor="rate">
          <MdOutlineAttachMoney />
        </label>
        <select
          name="rate"
          id="rate"
          onChange={(e) => changeRateInput(e)}
          value={query.rate}
        >
          <option value="">All rate</option>
          {priceRange.map((el) => {
            const limit = el.split("-");
            const min = limit[0];
            const max = limit[1];
            if (!max) {
              return (
                <option key={el} value={el}>
                  More than {min}
                </option>
              );
            } else {
              return (
                <option key={el} value={el}>
                  {min} to {max}
                </option>
              );
            }
          })}
        </select>
      </div>
      <div className="selection-container">
        <label htmlFor="active">
          <AiOutlinePoweroff />
        </label>
        <select
          id="active"
          name="active"
          value={query.active}
          onChange={(e) => changeActiveInput(e)}
        >
          <option value="">All Active</option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </div>

      <div className="selection-container date-selection">
        <div className="date-item">
          <label htmlFor="fromdate">From:</label>
          <input
            type="date"
            id="fromdate"
            name="fromdate"
            value={query.fromdate}
            onChange={(e) => changeFromDateInput(e)}
          />
        </div>
        <div className="date-item">
          <label htmlFor="todate">To:</label>
          <input
            type="date"
            id="todate"
            name="todate"
            value={query.todate}
            onChange={(e) => changeToDateInput(e)}
          />
        </div>
      </div>

      <button
        className="search-btn"
        onClick={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
      >
        Search
      </button>
    </form>
  );
};

export default Search;
