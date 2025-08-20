import axios from "axios";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip
);

const MonthlyLineChart = ({ userId }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Fetch monthly expense data by category for the past 12 months
    const fetchMonthlyExpenses = async () => {
      try {
        const response = await axios.get(
          `https://finance-87242397968.us-central1.run.app/expense/monthly/categories/${userId}`
        );
        const data = response.data; // Assuming data format is correct
        processChartData(data);
        console.log("Response", response.data);
      } catch (error) {
        console.error("Error fetching monthly expenses:", error);
      }
    };

    const processChartData = (data) => {
      // Generate an array of the last 12 months' short names (e.g., "Jan", "Feb", etc.)
      const months = Array.from({ length: 12 }, (_, i) =>
        new Date(new Date().setMonth(new Date().getMonth() - i)).toLocaleString(
          "default",
          { month: "short" }
        )
      ).reverse();

      // Define the categories we expect in the dataset
      const categories = [
        "food",
        "transportation",
        "entertainment",
        "shopping",
      ];

      // Map each category to its dataset, using data from each month
      const datasets = categories.map((category) => ({
        label: category.charAt(0).toUpperCase() + category.slice(1),
        data: months.map(
          (month) =>
            data[month]?.[
              category.charAt(0).toUpperCase() + category.slice(1)
            ] || 0
        ), // Match backend format for category capitalization
        fill: false,
        borderColor: getCategoryColor(category),
        backgroundColor: getCategoryColor(category),
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
      }));

      // Set chartData to update the chart
      setChartData({
        labels: months,
        datasets,
      });
    };

    const getCategoryColor = (category) => {
      const colors = {
        food: "rgba(255, 0, 0, 0.9)",
        entertainment: "rgba(255, 255, 0, 1)",
        transportation: "rgba(0, 0, 255, 0.9)",
        shopping: "rgba(60, 255, 80)",
      };
      return colors[category] || "rgba(0, 0, 0, 0.9)";
    };

    fetchMonthlyExpenses();
  }, [userId]);

  return (
    <div>
      <h4>Monthly Expenses</h4>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "white", // Set legend text color to white
                  usePointStyle: true, // Use circular points for legend labels
                  pointStyle: "circle", // Set point style to circle
                },
              },
              tooltip: {
                callbacks: { label: (item) => `$${item.raw.toFixed(2)}` },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Month",
                  color: "white",
                  font: { size: 14 },
                },
                ticks: { color: "white" }, // Set x-axis tick labels to white
              },
              y: {
                title: {
                  display: true,
                  text: "Amount ($)",
                  color: "white",
                  font: { size: 14 },
                },
                ticks: { color: "white" }, // Set y-axis tick labels to white
              },
            },
          }}
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default MonthlyLineChart;
