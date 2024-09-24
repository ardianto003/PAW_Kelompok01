import React, { useState, useEffect } from "react";
import CreateUserModal from "./components/CreateUser";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false); // Modal state


  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`);
      if (!response.ok) {
        console.log("🚀 ~ fetchUsers ~ response:", response)
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      console.log("🚀 ~ fetchUsers ~ data:", data)
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle new user creation
  const handleUserCreated = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Filter section */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Filter by name"
          className="border p-2 rounded-md"
        />
        <select className="border p-2 rounded-md">
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => setIsCreateUserModalOpen(true)} // Open modal on button click
        >
          Create New User
        </button>
      </div>

      {/* Loading and Error Handling */}
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table of users */}
      {!loading && !error && (
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Gender</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.gender}</td>
                <td className="border px-4 py-2">
                  <button className="bg-green-500 text-white p-1 rounded-md mr-2">
                    View
                  </button>
                  <button className="bg-yellow-500 text-white p-1 rounded-md mr-2">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white p-1 rounded-md">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Create New User Modal */}
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}

export default App;
