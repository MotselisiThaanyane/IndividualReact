import React, { useState, useEffect } from "react";
import bcrypt from "bcryptjs"; // Import bcrypt for hashing

const UserManagement = ({ users, setUsers }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editUserIndex, setEditUserIndex] = useState(null); // Fixed here
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/users");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e) => {
    // Fixed here
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newUser = {
      username,
      email,
    };

    // Only include password if it is provided
    if (password) {
      // Hash the password before sending
      const hashedPassword = await bcrypt.hash(password, 10);
      newUser.password = hashedPassword;
    }

    try {
      if (editUserIndex === null) {
        // Register new user
        const response = await fetch("http://localhost:5000/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
        if (response.ok) fetchUsers();
      } else {
        // Update existing user
        const response = await fetch(
          `http://localhost:5000/api/users/${users[editUserIndex].id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
          }
        );
        if (response.ok) {
          fetchUsers();
          setEditUserIndex(null); // Fixed here
        }
      }
    } catch (error) {
      setError("Error saving user");
    } finally {
      setLoading(false);
      setUsername("");
      setEmail("");
      setPassword(""); // Clear password after submission
    }
  };

  const editUser = (index) => {
    const user = users[index];
    setUsername(user.username);
    setEmail(user.email);
    setPassword(""); // Clear password field for security
    setEditUserIndex(index); // Fixed here
  };

  const deleteUser = async (index) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${users[index].id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) fetchUsers();
    } catch (error) {
      setError("Error deleting user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="userManagement">
      <h2>Manage Users</h2>
      <form onSubmit={handleUserSubmit}>
        <input
          type="text"
          value={username}
          placeholder="Username"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          value={email}
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading
            ? "Submitting..."
            : editUserIndex === null
            ? "Add User"
            : "Update User"}
        </button>
      </form>

      {error && <p>{error}</p>}

      <h3>Existing Users</h3>
      <table id="userTable">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => editUser(index)}>Edit</button>
                <button onClick={() => deleteUser(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default UserManagement;
