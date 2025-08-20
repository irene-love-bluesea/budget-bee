//COmponnents/Layout/Home
import React, { useState, useRef } from 'react';
import './Home.css'; // Import the CSS file for styling

const feedbacks = [
  { name: "Emily T.", message: "Before this app, tracking expenses was challenging and I often overspent. Now, filtering by day, week, or month gives me a clear view of my spending habits, making it easier to identify unnecessary costs and stick to my budget. This app has truly helped me get my finances in order and plan better for the future.", photo: "People.jpg" },
  { name: "Rick J.", message: "I love how I can set and track budget limits for different categories with ease. The Budgets feature helps me stay on track and avoid overspending, and I can quickly see how I’m doing against my goals. It’s been an invaluable tool for managing my money and achieving my financial goals. Highly recommended!", photo: "P1.jpg" },
  { name: "Jonas K.", message: "This finance tracker app is fantastic! The interface is sleek and easy to use, making expense tracking and budgeting a breeze. I love the detailed financial reports. The goal-setting feature keeps me motivated and on track. It’s secure, efficient, and a must-have for managing personal finances", photo: "P3.jpg" },
  { name: "Jessica C.", message: "I’ve been using the Finance Tracker app for a few months,  The intuitive Dashboard gives me a clear snapshot of income and expenses, while the Income Records feature lets me filter by day, week, or month, keeping me organized. It’s made budgeting and tracking much easier. Highly recommend it for anyone wanting to improve their financial health!", photo: "P2.jpg" },
  { name: "Susan R.", message: "I’m thrilled with this finance tracker app! It’s user-friendly and offers clear, insightful reports. Syncing with my bank accounts is smooth, and setting financial goals has never been easier. The app’s design and functionality are top-notch. Highly recommended for anyone looking to take control of their finances!", photo: "P4.jpg" },
];

const Home = () => {

  const [currentIndex, setCurrentIndex] = useState(0); 
  const feedbackRef = useRef(null); 

  const scrollToFeedback = (direction) => {
    const feedbackCard = feedbackRef.current.querySelector(".feedback-card"); // Select one feedback card
    const feedbackWidth = feedbackCard.offsetWidth + 20; // Includes card width and gap
  
    if (direction === "next") {
      // Scroll to the next card
      const newIndex = Math.min(currentIndex + 1, feedbacks.length - 1); // Increment index by 1
      setCurrentIndex(newIndex);
      feedbackRef.current.scrollTo({
        left: newIndex * feedbackWidth,
        behavior: "smooth",
      });
    } else if (direction === "prev") {
      // Scroll to the previous card
      const newIndex = Math.max(currentIndex - 1, 0); // Decrement index by 1
      setCurrentIndex(newIndex);
      feedbackRef.current.scrollTo({
        left: newIndex * feedbackWidth,
        behavior: "smooth",
      });
    }
  };
  


  return (

    <div className="home-container">
      <div className='banner'>
        <div className="home-description">
          <h1>Personal Finance Tracker</h1>
          <p className='home-p'>
            Welcome to BUDGET BEE!!<br></br>Your all-in-one personal finance tracker!!<br></br>
            Our intuitive platform helps you manage your money, track spending, and reach your financial goals effortlessly.Whether you want to budget, save, or analysis, we've got the tools you need to stay organized and financially fit.
          </p>
        </div>
        <div className="home-image">
          <img src="/home.png" alt="Placeholder" />
        </div>
      </div>
      <h1> How it Works</h1>
      <div className='how1'>
        <div className='howimage'>
          <img src="./dashboard.png" alt="dashboard" />
        </div>
        <div className='text'>
          <h2>Dashboard</h2>
          <p>  Our Finance Tracker offers a simple Dashboard for a quick view of your financial status. It shows your latest income and expenses, along with weekly and monthly reports. This feature helps you quickly understand your financial activity, track spending, and see income trends.
          </p>
        </div>
      </div>
      <div className='how1'>
        <div className='text text1'>
          <h2>Income Record</h2>
          <p>  The Income Records feature lets you track all your income in detail. You can filter by day, week, or month to easily see and analyze your earnings over different periods, helping you stay organized and manage your finances better.
          </p>
        </div>
        <div className='howimage image1'>
          <img src="./income.png" alt="dashboard" />
        </div>
      </div>
      <div className='how1'>
        <div className='howimage'>
          <img src="./expense.png" alt="dashboard" />
        </div>
        <div className='text'>
          <h2>Expense Record</h2>
          <p> The Expense Records feature helps you track and review all your spending. You can filter by day, week, or month to see where your money is going, which helps you understand your spending habits and make better financial decisions.
          </p>
        </div>
      </div>
      <div className='how1'>
        <div className='text text1'>
          <h2>Budget</h2>
          <p>  The Budgets feature lets you set spending limits for different categories. This helps you stay within your budget, avoid overspending, and manage your finances to meet your savings goals.</p>
        </div>
        <div className='howimage image1'>
          <img src="./Budget.png" alt="dashboard" />
        </div>
      </div>


      {/* Feedback Section */}
      <div className="feedback-section-wrapper">
        {/* Left Arrow */}
        <button
          className="arrow left-arrow"
          onClick={() => scrollToFeedback("prev")}
          disabled={currentIndex === 0}
        >
        <i class="fa-solid fa-circle-chevron-left"></i>
        </button>

        <div className="feedback-container" ref={feedbackRef}>
          {feedbacks.map((feedback, index) => (
            <div className="feedback-card" key={index}>
              <img src={feedback.photo} alt={feedback.name} className="user-photo" />
              <div className="feedback-content">
                <h3 className="user-name">{feedback.name}</h3>
                <p className="feedback-message">{feedback.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="arrow right-arrow"
          onClick={() => scrollToFeedback("next")}
          disabled={currentIndex >= feedbacks.length - 1}
        >
          <i className="fa-solid fa-circle-chevron-right"></i>
        </button>
      </div> {/* feedback end */}


    </div>  //container-end

  );
};

export default Home;