
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import GameCard from '../components/GameCard';
import { Gamepad, CheckSquare, Brain, BrainCircuit, Grid3X3, Mountain, Box } from 'lucide-react';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsLoaded(true);
  }, []);

  return (
    <Layout>
      <section className="py-12">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ease-in-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Welcome to <span className="text-calm-purple">Boredom Buster</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Take a moment to relax with our simple games and activities designed to reduce stress and bring calm to your day.
          </p>
          <Link to="/games" className="btn-calm">
            Start Playing
          </Link>
        </div>

        <div className={`mt-12 transition-all duration-1000 delay-300 ease-in-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl font-bold mb-8 text-center">Featured Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GameCard 
              title="Tic Tac Toe" 
              description="A classic game of X's and O's to exercise your mind." 
              icon={<CheckSquare size={32} />} 
              path="/games/tic-tac-toe"
              color="hover:bg-calm-lavender/20"
              imageSrc="https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=1974"
            />
            <GameCard 
              title="Sudoku" 
              description="Challenge your brain with number puzzles of varying difficulty." 
              icon={<Brain size={32} />} 
              path="/games/sudoku"
              color="hover:bg-calm-blue/20"
              imageSrc="https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&q=80&w=1973"
            />
            <GameCard 
              title="Monument Valley" 
              description="A peaceful puzzle game with gorgeous design and simple mechanics." 
              icon={<Mountain size={32} />} 
              path="/games/monument-valley"
              color="hover:bg-calm-purple/20"
              imageSrc="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2070"
            />
            <GameCard 
              title="Unpacking" 
              description="A meditative game where you unpack boxes and place objects in a new home." 
              icon={<Box size={32} />} 
              path="/games/unpacking"
              color="hover:bg-calm-yellow/20"
              imageSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070"
            />
            <GameCard 
              title="Tetris Effect" 
              description="A beautiful, immersive version of the classic game with calming visuals." 
              icon={<Grid3X3 size={32} />} 
              path="/games/tetris-effect"
              color="hover:bg-calm-green/20"
              imageSrc="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=2070"
            />
            <GameCard 
              title="Stress Check" 
              description="Measure your current stress levels with our quick assessment." 
              icon={<BrainCircuit size={32} />} 
              path="/stress-check"
              color="hover:bg-calm-yellow/20"
              imageSrc="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2032"
            />
          </div>
        </div>

        <div className={`mt-24 text-center bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-calm-lavender/50 transition-all duration-1000 delay-600 ease-in-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl font-bold mb-4">Why Play Games?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Simple games can help reduce stress by:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 text-calm-purple">Distraction</h3>
              <p className="text-gray-600">Taking your mind off stressors and giving you a mental break</p>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 text-calm-purple">Focus</h3>
              <p className="text-gray-600">Helping you practice mindfulness by concentrating on the present moment</p>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 text-calm-purple">Accomplishment</h3>
              <p className="text-gray-600">Providing small wins that boost your mood and confidence</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
