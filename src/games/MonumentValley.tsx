
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Mountain, RotateCw, Home, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const MonumentValley = () => {
  const { toast } = useToast();
  const [level, setLevel] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 75 });
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [showPaths, setShowPaths] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number, color: string}>>([]);
  const [ambientMode, setAmbientMode] = useState(false);

  // Generate initial particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.3 + 0.1,
      color: `hsl(${Math.random() * 60 + 240}, ${Math.random() * 30 + 60}%, ${Math.random() * 30 + 60}%)`
    }));
    setParticles(newParticles);
  }, [level]);

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          y: particle.y - particle.speed,
          x: particle.x + Math.sin(particle.y / 10) * 0.2,
          // Reset particle if it goes off screen
          ...(particle.y < 0 ? { y: 100, x: Math.random() * 100 } : {})
        }))
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // Level goal positions
  const goalPositions = {
    1: { x: 50, y: 25 },
    2: { x: 75, y: 25 },
    3: { x: 50, y: 50 }
  };

  // Check if player has reached the goal
  useEffect(() => {
    const goal = goalPositions[level as keyof typeof goalPositions];
    const distanceToGoal = Math.sqrt(
      Math.pow(playerPosition.x - goal.x, 2) + 
      Math.pow(playerPosition.y - goal.y, 2)
    );
    
    if (distanceToGoal < 10 && !isLevelComplete) {
      setIsLevelComplete(true);
      toast({
        title: "Path discovered!",
        description: `You've reached the goal. Ready for the next challenge!`,
      });
    }
  }, [playerPosition, level, isLevelComplete, toast]);

  // Handle keyboard navigation
  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setPlayerPosition(prev => {
      const newPos = { ...prev };
      
      const step = 5;
      
      switch(direction) {
        case 'up':
          newPos.y = Math.max(0, prev.y - step);
          break;
        case 'down':
          newPos.y = Math.min(100, prev.y + step);
          break;
        case 'left':
          newPos.x = Math.max(0, prev.x - step);
          break;
        case 'right':
          newPos.x = Math.min(100, prev.x + step);
          break;
      }
      
      // Add path checking logic based on the current rotation
      // This is a simplification - in a real game you'd check if the new position is valid
      const canMove = checkValidPath(prev, newPos, rotationAngle);
      
      return canMove ? newPos : prev;
    });
  }, [rotationAngle]);

  // Check if a move is valid based on the current rotation
  const checkValidPath = (current: {x: number, y: number}, next: {x: number, y: number}, rotation: number) => {
    // This is a simplified implementation - in a real game this would be more complex
    // For level 1
    if (level === 1) {
      // For 0 degrees, only allow vertical movement in the center
      if (rotation === 0) {
        return (current.x > 40 && current.x < 60) || (current.y > 70);
      } 
      // For 90 degrees, allow horizontal movement
      else if (rotation === 90) {
        return (current.y > 40 && current.y < 60) || (current.y > 70);
      }
      // For 180 degrees, only allow vertical movement on the sides
      else if (rotation === 180) {
        return (current.x < 30 || current.x > 70) || (current.y > 70);
      }
      // For 270 degrees, allow horizontal movement
      else if (rotation === 270) {
        return (current.y > 20 && current.y < 40) || (current.y > 70);
      }
    }
    // For level 2 and 3, simplify by always allowing movement
    return true;
  };

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp':
          movePlayer('up');
          break;
        case 'ArrowDown':
          movePlayer('down');
          break;
        case 'ArrowLeft':
          movePlayer('left');
          break;
        case 'ArrowRight':
          movePlayer('right');
          break;
        case 'r':
          handleRotate();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

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
    setPlayerPosition({ x: 50, y: 75 });
    setIsLevelComplete(false);
    toast({
      title: "Level complete!",
      description: `Moving to level ${Math.min(level + 1, 3)}`,
    });
  };

  const handleReset = () => {
    setPlayerPosition({ x: 50, y: 75 });
    setRotationAngle(0);
    toast({
      title: "Level reset",
      description: "Starting from the beginning.",
    });
  };

  const toggleAmbientMode = () => {
    setAmbientMode(!ambientMode);
    toast({
      title: ambientMode ? "Normal mode activated" : "Ambient mode activated",
      description: ambientMode ? "Standard gameplay restored." : "Relax and enjoy the visual experience.",
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

        <div className={`bg-white rounded-xl shadow-lg p-6 mb-8 transition-all duration-500 ${ambientMode ? 'bg-gradient-to-br from-calm-purple/20 to-calm-blue/20' : ''}`}>
          <p className="text-gray-600 mb-4">
            Inspired by the award-winning game, this simplified version challenges 
            you to navigate optical illusions and impossible architecture.
          </p>
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-calm-purple font-medium">Level: {level}/3</div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowPaths(!showPaths)} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                {showPaths ? "Hide Paths" : "Show Paths"}
              </Button>
              <Button 
                onClick={toggleAmbientMode} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                {ambientMode ? "Normal Mode" : "Ambient Mode"}
              </Button>
              <Button 
                onClick={handleRotate} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <RotateCw size={16} />
                Rotate
              </Button>
              <Button 
                onClick={handleReset} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Reset
              </Button>
            </div>
          </div>

          <div className="aspect-square relative bg-gradient-to-br from-calm-lavender/30 to-calm-purple/20 rounded-lg mb-6 overflow-hidden">
            {/* Ambient particles */}
            {ambientMode && particles.map(particle => (
              <div 
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  opacity: 0.7,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
                }}
              />
            ))}
            
            {/* Game structure */}
            <div 
              className="transition-transform duration-700 ease-in-out absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            >
              {level === 1 && (
                <div className="relative w-3/4 h-3/4">
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white/80 rounded-lg shadow-md"></div>
                  <div className="absolute bottom-0 left-1/4 w-1/6 h-1/4 bg-calm-purple/40 rounded-lg"></div>
                  <div className="absolute bottom-0 right-1/4 w-1/6 h-1/4 bg-calm-purple/40 rounded-lg"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/6 h-1/4 bg-calm-yellow/60 rounded-lg"></div>
                  
                  {/* Show possible paths when toggled */}
                  {showPaths && (
                    <>
                      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[5%] h-[50%] bg-white/40 rounded"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[5%] h-[25%] bg-white/40 rounded"></div>
                    </>
                  )}
                  
                  {/* Goal marker */}
                  <div className="absolute" style={{ 
                    left: `${goalPositions[1].x}%`, 
                    top: `${goalPositions[1].y}%`, 
                    transform: 'translate(-50%, -50%)'
                  }}>
                    <div className="w-6 h-6 rounded-full bg-yellow-400 animate-pulse"></div>
                  </div>
                </div>
              )}

              {level === 2 && (
                <div className="relative w-3/4 h-3/4">
                  <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white/80 rounded-lg shadow-md transform rotate-45"></div>
                  <div className="absolute top-1/8 left-1/2 transform -translate-x-1/2 w-1/4 h-1/4 bg-calm-blue/40 rounded-lg"></div>
                  <div className="absolute bottom-1/8 left-1/2 transform -translate-x-1/2 w-1/4 h-1/4 bg-calm-green/40 rounded-lg"></div>
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-1/4 h-1/4 bg-calm-yellow/60 rounded-lg"></div>
                  <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-1/4 h-1/4 bg-calm-yellow/60 rounded-lg"></div>
                  
                  {/* Show possible paths when toggled */}
                  {showPaths && (
                    <>
                      <div className="absolute top-1/2 left-1/4 w-1/2 h-[5%] bg-white/40 rounded"></div>
                      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[5%] h-1/4 bg-white/40 rounded"></div>
                    </>
                  )}
                  
                  {/* Goal marker */}
                  <div className="absolute" style={{ 
                    left: `${goalPositions[2].x}%`, 
                    top: `${goalPositions[2].y}%`, 
                    transform: 'translate(-50%, -50%)'
                  }}>
                    <div className="w-6 h-6 rounded-full bg-yellow-400 animate-pulse"></div>
                  </div>
                </div>
              )}

              {level === 3 && (
                <div className="relative w-3/4 h-3/4">
                  <div className="absolute inset-1/4 bg-white/80 rounded-lg shadow-md transform rotate-45"></div>
                  <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-calm-purple/20 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-calm-blue/20 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-calm-green/20 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-calm-yellow/20 rounded-br-lg"></div>
                  
                  {/* Show possible paths when toggled */}
                  {showPaths && (
                    <>
                      <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 bg-white/40 rounded"></div>
                      <div className="absolute top-1/2 left-0 w-full h-[5%] bg-white/40 rounded"></div>
                    </>
                  )}
                  
                  {/* Goal marker */}
                  <div className="absolute" style={{ 
                    left: `${goalPositions[3].x}%`, 
                    top: `${goalPositions[3].y}%`, 
                    transform: 'translate(-50%, -50%)'
                  }}>
                    <div className="w-8 h-8 rounded-full bg-yellow-400 animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Player character */}
            <div className="absolute z-20" style={{ 
              left: `${playerPosition.x}%`, 
              top: `${playerPosition.y}%`, 
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.3s ease-out'
            }}>
              <div className="w-6 h-6 rounded-full bg-red-400 animate-pulse shadow-lg shadow-red-300/50"></div>
            </div>
          </div>

          {/* Arrow controls */}
          <div className="grid grid-cols-3 gap-2 max-w-[150px] mx-auto mb-6">
            <div></div>
            <Button onClick={() => movePlayer('up')} variant="outline" size="icon" className="p-2">
              <ArrowUp size={18} />
            </Button>
            <div></div>
            <Button onClick={() => movePlayer('left')} variant="outline" size="icon" className="p-2">
              <ArrowLeft size={18} />
            </Button>
            <Button onClick={() => movePlayer('down')} variant="outline" size="icon" className="p-2">
              <ArrowDown size={18} />
            </Button>
            <Button onClick={() => movePlayer('right')} variant="outline" size="icon" className="p-2">
              <ArrowRight size={18} />
            </Button>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleNextLevel} 
              disabled={!isLevelComplete || level >= 3}
              className={`${isLevelComplete && level < 3 ? 'animate-pulse' : ''}`}
            >
              {level >= 3 && isLevelComplete ? "All Levels Complete" : "Next Level"}
            </Button>
          </div>
        </div>

        <div className="bg-white/70 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-calm-purple">How to Play</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Use arrow keys or the on-screen arrows to move your character (red dot)</li>
            <li>Rotate the structure (R key or Rotate button) to create new paths using optical illusions</li>
            <li>Find your way to the goal (yellow dot) to complete each level</li>
            <li>Toggle "Show Paths" for a hint if you get stuck</li>
            <li>Try "Ambient Mode" for a more relaxing experience</li>
            <li>Take your time - this is a relaxing experience, not a race</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default MonumentValley;
