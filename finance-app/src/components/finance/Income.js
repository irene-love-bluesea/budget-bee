// src/components/Income.js
import axios from "axios";
import { format } from "date-fns";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./Income.css";

const Income = () => {
  const { userId } = useParams(); // Retrieve the userId from the URL
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false); // For editing income
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [incomeList, setIncomeList] = useState([]);
  const [viewType, setViewType] = useState("daily"); // Default to daily
  const [error, setError] = useState(null);
  const icons = [
    "fa-solid fa-wallet",
    "fa-solid fa-chart-line",
    "fa-solid fa-coins",
    "fa-solid fa-plus-circle",
  ];
  const incomeApi = `https://finance-87242397968.us-central1.run.app/income`;
  const dailyButtonRef = useRef(null);
  const categoryIcons = [
    "fa-solid fa-ticket-simple",
    "fa-solid fa-user-graduate",
    "fa-solid fa-tags",
    "fa-solid fa-gift",
    "fa-solid fa-comments-dollar",
  ];
  const [selectedIcon, setSelectedIcon] = useState(categoryIcons[0]); // Default icon

  // Function to fetch income data based on the view type
  const fetchIncomeData = useCallback(
    async (type) => {
      try {
        const response = await axios.get(`${incomeApi}/${type}/${userId}`);
        setIncomeList(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
      console.log(`Fetching income data for userId: ${userId}, type: ${type}`);
    },
    [userId, incomeApi]
  );

  useEffect(() => {
    fetchIncomeData(viewType); // Fetch data when viewType changes
  }, [viewType, fetchIncomeData]);

  useEffect(() => {
    // Set focus on the Daily button when the component mounts
    if (dailyButtonRef.current) {
      dailyButtonRef.current.focus();
    }
  }, []);

  const handleBoxClick = (incomeType) => {
    if (incomeType === "Add") {
      setSelectedIncome(incomeType);
      setCategoryModalVisible(true);
    } else {
      setSelectedIncome(incomeType);
      setModalVisible(true);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    setCategoryModalVisible(false);
    setEditModalVisible(false);
    setAmount("");
    setCategory("");
    setError(null);
  };

  const saveIncome = async (categoryName) => {
    try {
      const incomeData = {
        category: categoryName,
        amount: parseFloat(amount),
        date: new Date().toISOString().split("T")[0], // Set to today's date in YYYY-MM-DD format
        icon: selectedIcon,
      };
      const response = await axios.post(
        `${incomeApi}/add/${userId}`,
        incomeData
      );

      if (response.status === 201) {
        setIncomeList((prevList) => [response.data, ...prevList]); // Update the list with the new income
        handleClose(); // Close the modal after saving
      }
      console.log(incomeList);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Set the error message from the backend if available
        setError("Income cannot be Zero or negative values!!");
      } else {
        setError("Failed to save Income");
      }
      console.error("Error saving Income:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedIncome === "Add") {
      saveIncome(category);
    } else {
      saveIncome(selectedIncome);
    }

    console.log(`Amount for ${selectedIncome}: ${amount}`);
    console.log(`Category: ${category}`);
    handleClose();
  };

  // Handle icon selection in the modal
  const handleIconClick = (icon) => {
    setSelectedIcon(icon);
  };

  const handleEditIncome = (income) => {
    setAmount("");
    setCategory(income.category);
    setSelectedIncome(income.id); // Store the income ID for editing
    setEditModalVisible(true);
  };

  const handleDeleteIncome = async (incomeId) => {
    try {
      const response = await axios.delete(`${incomeApi}/${userId}/${incomeId}`);
      if (response.status === 200) {
        setIncomeList(incomeList.filter((item) => item.id !== incomeId));
      }
    } catch (error) {
      // Log full error response
      console.error("Error response:", error.response);
      setError("Failed to delete Income");
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedIncome = {
        amount: parseFloat(amount),
        category: category,
        id: selectedIncome,
      };

      const response = await axios.put(
        `${incomeApi}/update/${userId}`,
        updatedIncome
      );
      if (response.status === 200) {
        setIncomeList((prevList) =>
          prevList.map((item) =>
            item.id === selectedIncome ? response.data : item
          )
        );
        handleClose();
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Set the error message from the backend if available
        setError("Income cannot be Zero or negative values!!");
        setEditModalVisible(false);
      } else {
        setError("Failed to update Income");
        console.error("Error updating Income:", error);
        setEditModalVisible(false);
      }
    }
  };

  return (
    <div className="income-container mt-5">
      {/* Error Alert Box */}
      {error && (
        <div className="error-alert">
          <div className="alert-content">
            <h5 style={{ fontWeight: "bold", color: "red" }}>Warning!!</h5>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Close</button>
          </div>
        </div>
      )}

      <p className="income-head">Choose Category</p>
      <div className="row-income">
        {["Salary", "Freelance", "Pocket Money", "Add"].map(
          (incomeType, index) => (
            <div
              key={index}
              className="col-md-2 d-flex justify-content-start"
              style={{ cursor: "pointer", marginBottom: "20px" }}
            >
              <div
                className="income-card text-center"
                onClick={() => {
                  handleBoxClick(incomeType);
                  handleIconClick(icons[index]);
                }}
              >
                <div className="income-type">{incomeType}</div>
                <div className="circle-icon">
                  <i className={icons[index]} style={{ color: "black" }}></i>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Modal for adding income */}
      {modalVisible && (
        <div className="modal-overlay" onClick={handleClose}>
          <div
            className="modal show"
            style={{ display: "block" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-dialog modal-dialog-centered income-m">
              <div className="modal-content income-modal-c">
                <div className="modal-header">
                  <h5 className="income-heading">Add {selectedIncome}</h5>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body income-body">
                    <div className="income-form">
                      <div className="form-items-income">
                        <label htmlFor="amount">Amount: </label>
                        <input
                          type="text"
                          className="form-control income-inputtext"
                          id="amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer income-mfoot">
                    <button
                      type="button"
                      className="income-cbtn"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn income-addbtn">
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {categoryModalVisible && (
        <div className="modal-overlay" onClick={handleClose}>
          <div
            className="modal show"
            style={{ display: "block" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content income-m">
                <div className="modal-header">
                  <h5 className="income-heading">Add new Category</h5>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body income-body">
                    <div className="income-form category-form-i">
                      <div className="form-items-category">
                        <label htmlFor="category" className="form-head">
                          Enter Category Name:{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control income-inputtext"
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-items-category icons">
                        <label htmlFor="icon" className="form-head">
                          Choose Icon:{" "}
                        </label>
                        <div className="icon-container">
                          {categoryIcons.map((icon, index) => (
                            <div className="icon-griditems">
                              <i
                                key={index}
                                className={`${icon} fa-2x`}
                                style={{
                                  color:
                                    selectedIcon === icon ? "#eac60b" : "black",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleIconClick(icon)}
                              ></i>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="form-items-category">
                        <label htmlFor="amount" className="form-head">
                          Enter Amount:{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control income-inputtext"
                          id="amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer income-mfoot">
                    <button
                      type="button"
                      className="income-cbtn"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn income-addbtn">
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal for editing income */}
      {editModalVisible && (
        <div className="modal-overlay" onClick={handleClose}>
          <div
            className="modal show"
            style={{ display: "block" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-dialog modal-dialog-centered income-m">
              <div className="modal-content income-modal-c income-m">
                <div className="modal-header">
                  <h5 className="income-heading">Edit Income</h5>
                </div>
                <form onSubmit={handleEditSubmit}>
                  <div className="modal-body income-body">
                    <div className="income-form">
                      <div className="form-items-income">
                        <label htmlFor="amount">Amount: </label>
                        <input
                          type="text"
                          className="form-control income-inputtext"
                          id="amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer income-mfoot">
                    <button
                      type="button"
                      className="income-cbtn"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn income-addbtn">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Income List */}
      <div>
        <div className="buttongroup" style={{ marginBottom: "20px" }}>
          <button
            ref={dailyButtonRef}
            onClick={() => setViewType("daily")}
            className={`filter-expense ${viewType === "daily" ? "active" : ""}`}
            id="expensedaily"
          >
            Daily
          </button>
          <button
            onClick={() => setViewType("weekly")}
            className={`filter-expense ${
              viewType === "weekly" ? "active" : ""
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setViewType("monthly")}
            className={`filter-expense ${
              viewType === "monthly" ? "active" : ""
            }`}
          >
            Monthly
          </button>
        </div>

        <div className="income-lists">
          {incomeList.map((income) => (
            <div key={income.id} className="income-item">
              <div className="category-income">
                <div className="circle-icon-ilist mb-3">
                  <i className={income.icon} style={{ color: "black" }}></i>
                </div>
                <div className="income-category">{income.category}</div>
              </div>
              <div className="income-date">
                {format(new Date(income.date), "dd MMM yyyy")}
              </div>
              <div className="income-amount">{income.amount} $</div>
              <div className="buttons">
                <button
                  onClick={() => handleEditIncome(income)}
                  className="income-edit"
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  onClick={() => handleDeleteIncome(income.id)}
                  className="income-delete"
                >
                  {" "}
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Income;
