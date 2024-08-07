import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import logo from '/LOGO.png';

const Header = () => {
  const navigate = useNavigate();//for navigation
  //state variables
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role'));
  const [userName, setUserName] = useState(localStorage.getItem('name'));

  //manage logout removeItem from localstorage
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setToken(null);
    setUserRole(null);
    setUserName(null);
    navigate('/login');
  };
// check timing of token
  const isTokenExpired = (token) => {
    try {
      // decode token and check its timing with current value
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };
// check if token is there and it is valid or not
  const checkTokenValidity = () => {
    if (token && isTokenExpired(token)) {
      handleLogout();
    }
  };

  useEffect(() => {
    checkTokenValidity();
    const intervalId = setInterval(checkTokenValidity, 60000);// Check token validity every minute
    return () => clearInterval(intervalId);
  }, [token]);

  //toggle dropdown functionality
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <NavLink to="/" className="text-xl font-semibold">
          <img src={logo} alt="Logo" className="h-8" />
        </NavLink>
        <button
          className="md:hidden text-white"
          onClick={toggleDropdown}
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <div className="hidden md:flex space-x-4">
          {!token ? (
            <>
              <NavLink className="px-3 py-2 rounded-md text-white" to="/register">Register</NavLink>
              <NavLink className="px-3 py-2 rounded-md text-white" to="/login">Log in</NavLink>
            </>
          ) : (
            <>
              {userRole === 'admin' && (
                <>
                  <NavLink className="px-3 py-2 rounded-md text-white" to="/user">Users</NavLink>
                  <NavLink className="px-3 py-2 rounded-md text-white" to="/manage-return-requests">Return Requests</NavLink>
                  <NavLink className="px-3 py-2 rounded-md text-white" to="/manage-stock">Stock</NavLink>
                </>
              )}
              {userRole === 'kiosk owner' && (
                <NavLink className="px-3 py-2 rounded-md text-white" to="/allocated-stock">Stock</NavLink>
              )}
              <div className="relative">
                <button
                  className="flex items-center px-3 py-2 rounded-md text-white"
                  onClick={toggleDropdown}
                >
                  {userName}
                  <svg
                    className="w-4 h-4 ml-2"
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
                  <ul className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg">
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
      </nav>
      {dropdownOpen && (
        <div className="md:hidden bg-gray-800 text-white">
          {!token ? (
            <>
              <NavLink
                className="block px-4 py-2 text-sm text-white"
                to="/register"
                onClick={() => setDropdownOpen(false)}
              >
                Register
              </NavLink>
              <NavLink
                className="block px-4 py-2 text-sm text-white"
                to="/login"
                onClick={() => setDropdownOpen(false)}
              >
                Log in
              </NavLink>
            </>
          ) : (
            <>
              {userRole === 'admin' && (
                <>
                  <NavLink
                    className="block px-4 py-2 text-sm text-white"
                    to="/user"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Users
                  </NavLink>
                  <NavLink
                    className="block px-4 py-2 text-sm text-white"
                    to="/manage-return-requests"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Return Requests
                  </NavLink>
                  <NavLink
                    className="block px-4 py-2 text-sm text-white"
                    to="/manage-stock"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Stock
                  </NavLink>
                </>
              )}
              {userRole === 'kiosk owner' && (
                <NavLink
                  className="block px-4 py-2 text-sm text-white"
                  to="/allocated-stock"
                  onClick={() => setDropdownOpen(false)}
                >
                  Stock
                </NavLink>
              )}
              <button
                className="block px-4 py-2 text-sm text-white"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
