import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditUser from '../components/EditUser';
import DeleteUser from '../components/DeleteUser';

const User = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [users, setUsers] = useState([]);
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
      }
    };

    fetchUsers();
  }, []);

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
      setError('Failed to delete user'+error);
    }
  };
  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {error ? (<p className="text-red-500">{error}</p>) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="py-4 px-6 border-b border-gray-200">{user.name}</td>
                  <td className="py-4 px-6 border-b border-gray-200">{user.email}</td>
                  <td className="py-4 px-6 border-b border-gray-200">{user.phoneNumber}</td>
                  <td className="py-4 px-6 border-b border-gray-200">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="px-4 py-2 font-medium text-xs text-white bg-blue-600 rounded-md hover:bg-blue-500" onClick={() => handleEditClick(user)}>Edit</button>
                    <button className="ml-2 px-4 py-2 font-medium text-xs text-white bg-red-600 rounded-md" onClick={() => handleDeleteClick(user)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
