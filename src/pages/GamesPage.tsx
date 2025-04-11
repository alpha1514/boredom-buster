
import React from 'react';
import Layout from '../components/Layout';
import GameCard from '../components/GameCard';
import { CheckSquare, Brain, Grid3X3, Box, Mountain } from 'lucide-react';

const GamesPage = () => {
  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Games Collection</h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Choose a game below to start playing. Each game is designed to provide a relaxing 
          experience while giving your mind a gentle workout.
        </p>

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
            title="Tetris Effect" 
            description="A beautiful, immersive version of the classic game with calming visuals." 
            icon={<Grid3X3 size={32} />} 
            path="/games/tetris-effect"
            color="hover:bg-calm-green/20"
            imageSrc="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=2070"
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
        </div>
      </div>
    </Layout>
  );
};

export default GamesPage;
