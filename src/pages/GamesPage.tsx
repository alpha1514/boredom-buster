
import React from 'react';
import Layout from '../components/Layout';
import GameCard from '../components/GameCard';
import { CheckSquare, Brain, Puzzle, Grid3X3 } from 'lucide-react';

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
          />
          <GameCard 
            title="Sudoku" 
            description="Challenge your brain with number puzzles of varying difficulty." 
            icon={<Brain size={32} />} 
            path="/games/sudoku"
            color="hover:bg-calm-blue/20"
          />
          <GameCard 
            title="Tetris Effect" 
            description="A beautiful, immersive version of the classic game with calming visuals." 
            icon={<Grid3X3 size={32} />} 
            path="/games/tetris-effect"
            color="hover:bg-calm-green/20"
          />
        </div>
      </div>
    </Layout>
  );
};

export default GamesPage;
