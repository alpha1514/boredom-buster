
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  imageSrc: string;
}

const GameCard = ({ title, description, icon, path, color, imageSrc }: GameCardProps) => {
  return (
    <Link to={path} className="block">
      <div className={`card-game group overflow-hidden relative ${color}`}>
        <div className="absolute -right-6 -top-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <div className="text-calm-purple/80" style={{ transform: 'scale(4)' }}>
            {icon}
          </div>
        </div>
        <div className="relative z-10">
          <div className="mb-4 text-calm-purple">
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        {imageSrc && (
          <div className="absolute inset-0 -z-10 opacity-10 group-hover:opacity-20 transition-all duration-300">
            <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </Link>
  );
};

export default GameCard;
