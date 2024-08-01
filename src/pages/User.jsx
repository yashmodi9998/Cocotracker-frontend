import { useEffect, useState } from 'react';
import axios from 'axios';
import EditUser from '../components/EditUser';
import DeleteUser from '../components/DeleteUser';
import Loader from '../components/Loader'; 

const User = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null); // State to hold the user being edited
  const [deleteUser, setDeleteUser] = useState(null); // State to hold the user to be deleted
  const token = localStorage.getItem('token');
  // State to manage form data for editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: ''
  });

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${url}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        setError('Failed to fetch User data');
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchUsers();
  }, [url, token]);

  // Function to handle edit button click
  const handleEditClick = (user) => {
    setEditUser(user); // Set the user to be edited
    setFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role
    });
  };

  // Function to handle delete button click
  const handleDeleteClick = (user) => {
    setDeleteUser(user); // Set the user to be deleted
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Function to handle form submission for editing
  const handleSubmit = async () => {
    try {
      // Send PUT request to update user
      await axios.put(`${url}/${editUser._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local users state after successful update
      const updatedUsers = users.map(user => {
        if (user._id === editUser._id) {
          return {
            ...user,
            ...formData
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setEditUser(null); // Reset edit state
    } catch (error) {
      setError('Failed to update user');
    }
  };

  // Function to handle deletion of user
  const handleDelete = async () => {
    try {
      // Send DELETE request to delete user
      await axios.delete(`${url}/${deleteUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter out the deleted user from the local state
      const updatedUsers = users.filter(user => user._id !== deleteUser._id);
      setUsers(updatedUsers);
      setDeleteUser(null); // Reset delete state
    } catch (error) {
      setError('Failed to delete user' + error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {loading ? (
        <Loader /> // Render the loader while loading
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {users.map((user) => (
            <div key={user._id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
              <p className="text-gray-600 mb-2">Email: {user.email}</p>
              <p className="text-gray-600 mb-2">Phone: {user.phoneNumber}</p>
              <p className="text-gray-600 mb-2">Role: {user.role}</p>
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                Active
              </span>
              <div className="mt-4 flex space-x-2">
                <button
                  className="px-4 py-2 font-medium text-xs text-white bg-blue-600 rounded-md hover:bg-blue-500"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 font-medium text-xs text-white bg-red-600 rounded-md hover:bg-red-500"
                  onClick={() => handleDeleteClick(user)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit User Modal */}
      <EditUser
        isOpen={!!editUser}
        title="Edit User"
        closeModal={() => setEditUser(null)}
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
      />
      {/* Delete User Modal */}
      {deleteUser && (
        <DeleteUser
          isOpen={!!deleteUser}
          title="Delete User"
          closeModal={() => setDeleteUser(null)}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default User;
