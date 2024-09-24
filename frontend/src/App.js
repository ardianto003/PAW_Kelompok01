import React, { useState, useEffect } from "react";
import CreateUserModal from "./components/CreateUser";
import EditUserModal from "./components/EditUser";
import ViewUserModal from "./components/ViewUser"; 

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false); // Modal state
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // State for the current user ID

  // Filter and Sort states
  const [filterName, setFilterName] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // sortOrder can be "name" or "-name"

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users?name=${filterName}&gender=${filterGender}&sort=${sortOrder}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filterName, filterGender, sortOrder]); // Fetch users when filters change

  const handleUserCreated = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleViewUser = (userId) => {
    setCurrentUserId(userId);
    setIsViewUserModalOpen(true);
  };

  const handleSort = (field) => {
    setSortOrder((prevOrder) => {
      if (prevOrder === field) return `-${field}`; // Toggle to descending
      return field; // Ascending
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Filter by name"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="border p-2 rounded-md"
        />
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => setIsCreateUserModalOpen(true)}
        >
          Create New User
        </button>
      </div>

      <button
        onClick={() => handleSort('name')}
        className="mb-4 bg-gray-500 text-white p-2 rounded-md"
      >
        Sort by Name
      </button>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

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
                  <button
                    onClick={() => handleViewUser(user._id)} // Open view modal on button click
                    className="bg-green-500 text-white p-1 rounded-md mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditUser(user)} // Open edit modal on button click
                    className="bg-yellow-500 text-white p-1 rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 text-white p-1 rounded-md"
                  >
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

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        onUserUpdated={handleUserUpdated}
        user={currentUser}
      />

      {/* View User Modal */}
      <ViewUserModal
        isOpen={isViewUserModalOpen}
        onClose={() => setIsViewUserModalOpen(false)}
        userId={currentUserId} // Pass the current user ID to the modal
      />
    </div>
  );
}

export default App;
