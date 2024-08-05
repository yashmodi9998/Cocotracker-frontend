import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '/LOGO.png';
const Header = () => {
  
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const userName = localStorage.getItem('name');

  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    window.location.href = '/login'; // Redirect to home page
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown 
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
