import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; 
import logo from '/LOGO.png';

const Header = () => {
  const navigate = useNavigate(); // For navigation
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility
  const [token, setToken] = useState(localStorage.getItem('token')); // Manage token in state
  const [userRole, setUserRole] = useState(localStorage.getItem('role')); // Manage user role in state
  const [userName, setUserName] = useState(localStorage.getItem('name')); // Manage user name in state

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setToken(null);
    setUserRole(null);
    setUserName(null);
    navigate('/login'); // Redirect to login page
  };

  // Function to check if the token is expired
  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const isExpired = decodedToken.exp * 1000 < Date.now(); // Token expiry time in milliseconds
      return isExpired;
    } catch (error) {
      console.error('Error decoding token:', error); // Debugging statement
      return true; // If decoding fails, assume token is expired
    }
  };

  // Function to check token validity and handle redirection
  const checkTokenValidity = () => {
    if (token && isTokenExpired(token)) {
      handleLogout();
    }
  };

  // Check token validity on component mount and on token change
  useEffect(() => {
    checkTokenValidity();
    const intervalId = setInterval(checkTokenValidity, 60000); // Check token validity every minute
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [checkTokenValidity]);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header id="header">
      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto py-4 px-6 md:flex md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="text-xl font-semibold">
              <img src={logo} alt="CocoTracker Logo" className="h-10 w-auto" />
            </NavLink>
            <button
              className="md:hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 p-2"
              type="button"
              aria-label="Toggle navigation"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!token ? (
              <>
                <NavLink
                  className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  to="/register"
                >
                  Register
                </NavLink>
                <NavLink
                  className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  to="/login"
                >
                  Log in
                </NavLink>
              </>
            ) : (
              <>
                {userRole === 'admin' && (
                  <>
                    <NavLink
                      className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                      to="/user"
                    >
                      Users
                    </NavLink>
                    <NavLink
                      className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                      to="/manage-return-requests"
                    >
                      Return Requests
                    </NavLink>
                    <NavLink
                      className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                      to="/manage-stock"
                    >
                      Stock
                    </NavLink>
                  </>
                )}
                {userRole === 'kiosk owner' && (
                  <NavLink
                    className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    to="/allocated-stock"
                  >
                    Stock
                  </NavLink>
                )}
                <div className="relative">
                  <button
                    className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                    onClick={toggleDropdown}
                  >
                    {userName}
                    <svg
                      className="w-4 h-4 ml-1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <ul className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg z-10">
                      <li>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;