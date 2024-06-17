import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const isLoggedIn =localStorage.getItem('token');
const userRole = localStorage.getItem('role');
  return (
    <header id="header">
      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto py-4 px-6 md:flex md:items-center md:justify-between">
          <div className="flex items-center justify-between">
               <NavLink to="/" className="text-xl font-semibold">
              <span className="text-gray-300">Coco</span>
              <span className="text-gray-100">Tracker</span>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* if user is not logged in */}
          {!isLoggedIn ? (
              <><NavLink
              className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              activeClassName="bg-gray-900"
              exact
              to="/"
            >
              
            </NavLink>
            
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
            ) : 
            // if user is logged in
            (
              <> 
                   
               {/* if user role is admin, show dashboard link */}
               {userRole === 'admin' && (
                  <NavLink
                    className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    to="/user"
                  >
                    User
                  </NavLink>
                )} 
{/* logout  */}
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                onClick={() => {
                  // remove token for logout.
                  localStorage.removeItem('token');
                  window.location.href = '/';
                }}
              >
                Log Out
              </button>
              </>

            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
