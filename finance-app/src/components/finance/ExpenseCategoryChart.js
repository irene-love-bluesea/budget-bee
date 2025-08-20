import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseCategoryChart = ({ userId }) => {
  const [categoryData, setCategoryData] = useState({});
  const expenseApi = `https://finance-87242397968.us-central1.run.app/expense`;

  // Define a color mapping for categories
  const categoryColors = {
    Food: "rgba(255, 0, 0, 1)", // Red for Food
    Transportation: "rgba(0, 0, 235)", // Blue for Transport
    Entertainment: "rgba(255, 255, 0, 1)", // Yellow for Entertainment
    Shopping: "rgba(60, 255, 80)", // Green for Shopping
    Others: "rgba(153, 102, 255)", // Purple for Other categories
  };

  useEffect(() => {
    // Fetch the category-wise expenses data from the backend
    fetch(`${expenseApi}/weekly/categories/${userId}`)
      .then((response) => response.json())
      .then((data) => setCategoryData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [userId]);

  // Map categories to colors dynamically
  const backgroundColors = Object.keys(categoryData).map(
    (category) => categoryColors[category] || categoryColors["Others"]
  );
  const borderColors = backgroundColors.map((color) =>
    color.replace("0.2", "1")
  ); // Make border color more opaque

  const data = {
    labels: Object.keys(categoryData), // Category names (e.g., "Food", "Transportation")
    datasets: [
      {
        data: Object.values(categoryData), // Corresponding sum of expenses
        backgroundColor: backgroundColors, // Dynamic background color based on category
        borderColor: borderColors, // Dynamic border color based on category
        borderWidth: 1,
        barThickness: 40, // Adjust bar width if needed
      },
    ],
  };

  console.log("Fetched category data:", data);

  return (
    <div>
      <h4>Weekly Expenses</h4>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false, // Hides the legend
            },
            tooltip: {
              titleColor: "white",
              bodyColor: "white",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Category",
                color: "white",
                font: { size: 14 },
              },
              ticks: {
                color: "white",
              },
            },
            y: {
              title: {
                display: true,
                text: "Amount ($)",
                color: "white",
                font: { size: 14 },
              },
              ticks: {
                color: "white",
              },
            },
          },
          title: {
            display: true,
            text: "Weekly Expenses by Category",
            color: "white",
          },
        }}
      />
    </div>
  );
};

export default ExpenseCategoryChart;
