
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white/70 backdrop-blur-md py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Boredom Buster. All rights reserved.
            </p>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span>Made with</span>
            <Heart size={16} className="mx-1 text-red-500 fill-red-500" />
            <span>for your mental wellbeing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
