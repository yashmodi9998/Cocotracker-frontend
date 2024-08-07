import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between  ">
        <p className="text-sm">&copy; {new Date().getFullYear()} NGCocoTracker. All rights reserved.</p>
        
      </div>
    </footer>
  );
};

export default Footer;
