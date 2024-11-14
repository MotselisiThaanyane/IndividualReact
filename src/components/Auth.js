// src/components/Auth.js

import React, { useState } from "react";

function Auth({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous errors
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        alert("Registration successful! Please log in.");
        setIsRegistering(false);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Error registering:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous errors
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        onLogin();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Invalid username or password!");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      {isRegistering ? (
        <form onSubmit={handleRegisterSubmit}>
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
          <p>
            Have an account?{" "}
            <button type="button" onClick={() => setIsRegistering(false)}>
              Login
            </button>
          </p>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      ) : (
        <form onSubmit={handleLoginSubmit}>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <p>
            Don't have an account?{" "}
            <button type="button" onClick={() => setIsRegistering(true)}>
              Register
            </button>
          </p>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      )}
    </div>
  );
}

export default Auth;
