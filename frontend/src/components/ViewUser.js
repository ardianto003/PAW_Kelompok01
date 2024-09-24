import React, { useState, useEffect } from "react";

function ViewUserModal({ isOpen, onClose, userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }
          const data = await response.json();
          setUser(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else {
      setUser(null); // Reset user state when modal is closed
    }
  }, [isOpen, userId]);

  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">User Details</h2>
        {loading && <p>Loading user details...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {user && (
          <div>
            <p className="mb-2"><strong>Name:</strong> {user.name}</p>
            <p className="mb-2"><strong>Email:</strong> {user.email}</p>
            <p className="mb-2"><strong>Gender:</strong> {user.gender}</p>
          </div>
        )}
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white p-2 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewUserModal;
