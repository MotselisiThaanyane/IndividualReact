// index.js
const express = require("express");
const mysql = require("mysql2"); // Use mysql2 package
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root", // replace with your MySQL username
  password: "thato09", // replace with your MySQL password
  database: "wings_inventory",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// User routes
app.post("/api/users", (req, res) => {
  const { username, email, password } = req.body;
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, password], (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id: result.insertId, username, email });
  });
});

app.get("/api/users", (req, res) => {
  db.query("SELECT id, username, email FROM users", (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(results);
  });
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  const sql =
    "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?";
  db.query(sql, [username, email, password, id], (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.sendStatus(204);
  });
});

app.put("/users/:id", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userUpdates = { username, email };

    // Hash new password if it's provided
    if (password) {
      userUpdates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      userUpdates,
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.sendStatus(204);
  });
});

// Assuming you already have the necessary imports at the top
const bcrypt = require("bcrypt"); // For password hashing

// In-memory user store (for demonstration purposes)
let users = [];

// Register route
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the user already exists
  const sqlCheck = "SELECT * FROM Users WHERE username = ? OR email = ?";
  db.query(sqlCheck, [username, email], (err, results) => {
    if (err) return res.status(400).json({ message: "Database error." });
    if (results.length > 0) {
      return res.status(400).json({ message: "User  already exists." });
    }

    // Hash the password before saving
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err)
        return res.status(500).json({ message: "Error hashing password." });

      // Create a new user in the database
      const sqlInsert =
        "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";
      db.query(sqlInsert, [username, email, hashedPassword], (err, result) => {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ id: result.insertId, username, email });
      });
    });
  });
});

// Login route
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  // Query the database for the user
  const sql = "SELECT * FROM Users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error." });

    // Check if the user exists
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    // Compare the password with the hashed password in the database
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.status(200).json({ message: "Login successful!" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

// Product routes
app.post("/api/products", (req, res) => {
  const { name, description, category, price, quantity } = req.body;
  const sql =
    "INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [name, description, category, price, quantity],
    (err, result) => {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({
        id: result.insertId,
        name,
        description,
        category,
        price,
        quantity,
      });
    }
  );
});

app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(results);
  });
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, quantity } = req.body;
  const sql =
    "UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?";
  db.query(sql, [name, description, category, price, quantity, id], (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.sendStatus(204);
  });
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.sendStatus(204);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
