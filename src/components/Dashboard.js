import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Prepare data for the chart
  const productNames = [...new Set(products.map((product) => product.name))];
  const quantities = productNames.map((name) =>
    products
      .filter((product) => product.name === name)
      .reduce((total, product) => total + Number(product.quantity), 0)
  );

  const data = {
    labels: productNames,
    datasets: [
      {
        label: "Product Quantity",
        data: quantities,
        backgroundColor: "burlywood", 
        borderColor: "rgba(173, 135, 135, 0.801)", // Full opacity for the border
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "black", // Set legend text color to black
        },
      },
      title: {
        display: true,
        text: "Products Overview",
        color: "rgb(184, 177, 177)", // Set chart title color to black
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "black", // Set x-axis labels color to black
        },
        grid: {
          color: "rgba(0, 0, 0, 0.5)", // Optional: Adjust grid line color for visibility
        },
      },
      y: {
        ticks: {
          color: "black", // Set y-axis labels color to black
        },
        grid: {
          color: "rgba(0, 0, 0, 0.5)", // Optional: Adjust grid line color for visibility
        },
      },
    },
    maintainAspectRatio: false,
  };
  
  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <div style={{ width: "700px", height: "400px", margin: "auto" }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export default Dashboard;
