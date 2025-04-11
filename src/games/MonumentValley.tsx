
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Mountain, RotateCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const MonumentValley = () => {
  const { toast } = useToast();
  const [level, setLevel] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);

  const handleRotate = () => {
    setRotationAngle((prev) => (prev + 90) % 360);
    toast({
      title: "Structure rotated!",
      description: "New paths may have opened up.",
    });
  };

  const handleNextLevel = () => {
    setLevel((prev) => Math.min(prev + 1, 3));
    setRotationAngle(0);
    toast({
      title: "Level complete!",
      description: `Moving to level ${Math.min(level + 1, 3)}`,
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Monument Valley</h1>
          <Link to="/games" className="text-calm-purple hover:underline flex items-center gap-2">
            <Home size={20} />
            Back to Games
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <p className="text-gray-600 mb-4">
            Inspired by the award-winning game, this simplified version challenges 
            you to navigate optical illusions and impossible architecture.
          </p>
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-calm-purple font-medium">Level: {level}/3</div>
            <Button onClick={handleRotate} variant="outline" className="flex items-center gap-2">
              <RotateCw size={16} />
              Rotate Structure
            </Button>
          </div>

          <div className="aspect-square relative bg-gradient-to-br from-calm-lavender/30 to-calm-purple/20 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
            <div 
              className="transition-transform duration-700 ease-in-out w-3/4 h-3/4"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            >
              {level === 1 && (
                <div className="relative w-full h-full">
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white/80 rounded-lg shadow-md"></div>
                  <div className="absolute bottom-0 left-1/4 w-1/6 h-1/4 bg-calm-purple/40 rounded-lg"></div>
                  <div className="absolute bottom-0 right-1/4 w-1/6 h-1/4 bg-calm-purple/40 rounded-lg"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/6 h-1/4 bg-calm-yellow/60 rounded-lg"></div>
                  <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-400 animate-pulse"></div>
                </div>
              )}

              {level === 2 && (
                <div className="relative w-full h-full">
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white/80 rounded-lg shadow-md transform rotate-45"></div>
                  <div className="absolute top-1/8 left-1/2 transform -translate-x-1/2 w-1/4 h-1/4 bg-calm-blue/40 rounded-lg"></div>
                  <div className="absolute bottom-1/8 left-1/2 transform -translate-x-1/2 w-1/4 h-1/4 bg-calm-green/40 rounded-lg"></div>
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-1/4 h-1/4 bg-calm-yellow/60 rounded-lg"></div>
                  <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1/4 h-1/4 bg-calm-yellow/60 rounded-lg"></div>
                  <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-red-400 animate-pulse"></div>
                </div>
              )}

              {level === 3 && (
                <div className="relative w-full h-full">
                  <div className="absolute inset-1/4 bg-white/80 rounded-lg shadow-md transform rotate-45"></div>
                  <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-calm-purple/20 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-calm-blue/20 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-calm-green/20 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-calm-yellow/20 rounded-br-lg"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-400 animate-pulse"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleNextLevel} disabled={level >= 3}>
              {level >= 3 ? "All Levels Complete" : "Complete Level"}
            </Button>
          </div>
        </div>

        <div className="bg-white/70 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-calm-purple">How to Play</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Observe the structure and find a path for your character (red dot)</li>
            <li>Rotate the structure to create new paths using optical illusions</li>
            <li>Complete each level by guiding your character to the goal</li>
            <li>Take your time - this is a relaxing experience, not a race</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default MonumentValley;
