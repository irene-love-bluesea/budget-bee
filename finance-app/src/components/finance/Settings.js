import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Settings.css"; // Your custom CSS (if needed)

const Settings = () => {
  const { userId } = useParams();
  const [accordionState, setAccordionState] = useState({
    itemOneOpen: false,
    itemTwoOpen: false,
    itemThreeOpen: false,
    itemFourOpen: false,
  });

  const toggleAccordion = (item) => {
    setAccordionState((prevState) => ({
      ...prevState,
      [item]: !prevState[item],
    }));
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `https://finance-87242397968.us-central1.run.app/user/${userId}/financial-data`
      );
      const data = response.data;

      // Create a Blob from the JSON data
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      // Create a temporary link to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = `financial_data_user_${userId}.json`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading financial data:", error);
    }
  };

  return (
    <div className="container settings-container text-start">
      <h1 className="setting-title fw-bold">Settings</h1>

      <div className="accordion" id="accordionPanelsStayOpenExample">
        {/* Accordion Item 1 */}
        <div className="accordion-item setting-accordion">
          <h2 className="accordion-header" id="panelsStayOpen-headingOne">
            <button
              className={`accordion-button ${
                !accordionState.itemOneOpen ? "collapsed" : ""
              }`}
              type="button"
              data-bs-toggle="collapse"
              aria-expanded={accordionState.itemOneOpen}
              onClick={() => toggleAccordion("itemOneOpen")}
              aria-controls="panelsStayOpen-collapseOne"
            >
              <i className="fa-solid fa-bell me-3 setting-icon"></i>
              Notifications
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseOne"
            className={`accordion-collapse collapse ${
              accordionState.itemOneOpen ? "show" : ""
            }`}
            aria-labelledby="panelsStayOpen-headingOne"
          >
            <div className="accordion-body">
              <p>
                Stay up to date with important alerts and updates. Customize
                your notifications preferences to receive reminders about budget
                limits, saving goal and account activity.
              </p>
              <p className="mt-3">Receive notifications?</p>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  value="option1"
                />
                <label class="form-check-label" for="inlineRadio1">
                  Yes{" "}
                </label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  class="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio2"
                  value="option2"
                />
                <label class="form-check-label" for="inlineRadio2">
                  No
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Item 2 */}
        <div className="accordion-item setting-accordion">
          <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
            <button
              className={`accordion-button ${
                !accordionState.itemTwoOpen ? "collapsed" : ""
              }`}
              type="button"
              data-bs-toggle="collapse"
              aria-expanded={accordionState.itemTwoOpen}
              onClick={() => toggleAccordion("itemTwoOpen")}
              aria-controls="panelsStayOpen-collapseTwo"
            >
              <i class="fa-solid fa-file-arrow-down setting-icon me-3"></i>
              Download Financial Data
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseTwo"
            className={`accordion-collapse collapse ${
              accordionState.itemTwoOpen ? "show" : ""
            }`}
            aria-labelledby="panelsStayOpen-headingTwo"
          >
            <div className="accordion-body">
              <p>
                Enable automatic download to ensure your information is safely
                stored and easily accessible whenever you need it.
              </p>
              <button
                type="button"
                className="btn mt-3 backup-btn"
                onClick={handleDownload}
              >
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Accordion Item 3 */}
        <div className="accordion-item setting-accordion">
          <h2 className="accordion-header" id="panelsStayOpen-headingThree">
            <button
              className={`accordion-button ${
                !accordionState.itemThreeOpen ? "collapsed" : ""
              }`}
              type="button"
              data-bs-toggle="collapse"
              aria-expanded={accordionState.itemThreeOpen}
              onClick={() => toggleAccordion("itemThreeOpen")}
              aria-controls="panelsStayOpen-collapseThree"
            >
              <i class="fa-solid fa-circle-question me-3 setting-icon"></i>
              Help
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseThree"
            className={`accordion-collapse collapse ${
              accordionState.itemThreeOpen ? "show" : ""
            }`}
            aria-labelledby="panelsStayOpen-headingThree"
          >
            <div className="accordion-body">
              <p>
                Need assistance? Access our help center for tutorials, FAQs and
                customer support to guide you through using the finance tracker.
              </p>
              <a href="#" className="contact-link">
                Contact us
              </a>{" "}
              for more details.
            </div>
          </div>
        </div>

        {/* Accordion Item 4 */}
        <div className="accordion-item setting-accordion">
          <h2 className="accordion-header" id="panelsStayOpen-headingThree">
            <button
              className={`accordion-button ${
                !accordionState.itemFourOpen ? "collapsed" : ""
              }`}
              type="button"
              data-bs-toggle="collapse"
              aria-expanded={accordionState.itemFourOpen}
              onClick={() => toggleAccordion("itemFourOpen")}
              aria-controls="panelsStayOpen-collapseThree"
            >
              <i class="fa-solid fa-shield me-3 setting-icon"></i>
              Privacy Policy
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseThree"
            className={`accordion-collapse collapse ${
              accordionState.itemFourOpen ? "show" : ""
            }`}
            aria-labelledby="panelsStayOpen-headingThree"
          >
            <div className="accordion-body">
              <p>
                Your privacy matters to us. Learn more about how we protect your
                personal and financial information in our comprehensive privacy
                policy.
              </p>
              <a href="#" className="contact-link">
                Contact us
              </a>{" "}
              for more details.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
