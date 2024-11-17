import React from 'react';
import { Link } from 'react-router-dom';
import { Users, User, BarChart2 } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6">
      {/* Application Title */}
      <header className="text-center mt-8">
        <h1 className="text-4xl font-light tracking-wide text-blue-600">
          What's the Move
        </h1>
      </header>

      {/* Main content container */}
      <div className="w-full max-w-lg mx-auto mt-12">
        {/* Logo container - Increased size */}
        <div className="flex justify-center mb-12">
          <div className="w-48 h-48 bg-blue-50 rounded-full flex items-center justify-center p-8">
            <img
              src="../logo192.png"
              alt="Logo"
              className="w-full h-full object-contain opacity-90"
            />
          </div>
        </div>

        {/* Navigation Buttons - Modified Grid */}
        <div className="grid grid-cols-2 gap-6 px-4">
          {/* Friends Button - Now spans 2 columns */}
          <Link 
            to="/friends" 
            className="col-span-2 group transition-all duration-300"
          >
            <div className="bg-blue-500 rounded-2xl p-8 shadow-lg shadow-blue-500/20 
                         hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300
                         flex items-center justify-center space-x-4">
              <Users size={24} className="text-white" />
              <span className="text-white text-lg font-medium">Friends</span>
            </div>
          </Link>

          {/* Profile Button */}
          <Link 
            to="/profile" 
            className="group transition-all duration-300"
          >
            <div className="bg-purple-500 rounded-2xl p-8 shadow-lg shadow-purple-500/20 
                         hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300
                         flex items-center justify-center space-x-3">
              <User size={24} className="text-white" />
              <span className="text-white text-lg font-medium">Profile</span>
            </div>
          </Link>

          {/* Results Button */}
          <Link 
            to="/results" 
            className="group transition-all duration-300"
          >
            <div className="bg-green-500 rounded-2xl p-8 shadow-lg shadow-green-500/20 
                         hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300
                         flex items-center justify-center space-x-3">
              <BarChart2 size={24} className="text-white" />
              <span className="text-white text-lg font-medium">Results</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;