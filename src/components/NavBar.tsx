
import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad, BrainCircuit, HomeIcon } from 'lucide-react';

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-md shadow-sm z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Gamepad size={28} className="text-calm-purple" />
            <span className="text-xl font-bold text-calm-purple">Boredom Buster</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex flex-col items-center text-sm font-medium text-gray-600 hover:text-calm-purple transition-colors">
              <HomeIcon size={20} />
              <span>Home</span>
            </Link>
            <Link to="/games" className="flex flex-col items-center text-sm font-medium text-gray-600 hover:text-calm-purple transition-colors">
              <Gamepad size={20} />
              <span>Games</span>
            </Link>
            <Link to="/stress-check" className="flex flex-col items-center text-sm font-medium text-gray-600 hover:text-calm-purple transition-colors">
              <BrainCircuit size={20} />
              <span>Stress Check</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
