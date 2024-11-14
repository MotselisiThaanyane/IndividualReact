import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProductManagement from "./components/ProductManagement";
import UserManagement from "./components/UserManagement";
import Auth from "./components/Auth";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch products and users from the database when the component mounts
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch((err) => console.error("Error fetching products:", err));

    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <header>
          <h1>Wings Cafe Inventory System</h1>
          {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </header>
        {isLoggedIn ? (
          <>
            <nav>
              <ul>
                <li>
                  <Link to="/dashboard">Stock Overview</Link>
                </li>
                <li>
                  <Link to="/productManagement">Product Management</Link>
                </li>
                <li>
                  <Link to="/userManagement">User Management</Link>
                </li>
              </ul>
            </nav>
            <Routes>
              <Route
                path="/dashboard"
                element={<Dashboard products={products} />}
              />
              <Route
                path="/productManagement"
                element={
                  <ProductManagement
                    products={products}
                    setProducts={setProducts}
                  />
                }
              />
              <Route
                path="/userManagement"
                element={<UserManagement users={users} setUsers={setUsers} />}
              />
              <Route path="/" element={<Navigate replace to="/dashboard" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Auth onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
