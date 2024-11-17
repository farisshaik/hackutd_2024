import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col p-4">
      {/* Main content container */}
      <div className="w-full max-w-md mx-auto mt-8 md:mt-12">        
        {/* Logo container */}
        <div className="flex justify-center mb-auto">
            <img
              src="../logo192.png"
              alt="Logo"
              className="w-1/2 h-full object-contain"/>
        </div>
        {/* Button container - positioned at bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
        <Link to="/friends" className="w-full inline-block">
            <button className="w-full bg-blue-500 text-white py-2 rounded-md 
                hover:bg-blue-600 transition-colors duration-200
                text-sm md:text-base
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                Continue
            </button>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;