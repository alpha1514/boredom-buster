
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { useToast } from '@/hooks/use-toast';

// Define tetromino shapes
const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-orange-500' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' }
};

// Game constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const EMPTY_CELL = 0;

const TetrisEffect = () => {
  const { toast } = useToast();
  
  // Game state
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [level, setLevel] = useState(1);
  const [nextPiece, setNextPiece] = useState(null);
  
  // Create an empty game board
  function createEmptyBoard() {
    return Array.from({ length: BOARD_HEIGHT }, () => 
      Array.from({ length: BOARD_WIDTH }, () => EMPTY_CELL)
    );
  }

  // Generate a random tetromino
  const randomTetromino = useCallback(() => {
    const keys = Object.keys(TETROMINOES);
    const tetroKey = keys[Math.floor(Math.random() * keys.length)];
    return {
      shape: TETROMINOES[tetroKey].shape,
      color: TETROMINOES[tetroKey].color,
      key: tetroKey
    };
  }, []);
  
  // Start new game
  const startGame = useCallback(() => {
    // Reset the game state
    setBoard(createEmptyBoard());
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    
    // Create the initial tetromino
    const initialPiece = randomTetromino();
    const nextPiece = randomTetromino();
    
    // Place the tetromino at the top center of the board
    setCurrentPiece(initialPiece);
    setNextPiece(nextPiece);
    setPosition({ 
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(initialPiece.shape[0].length / 2), 
      y: 0 
    });
    
    toast({
      title: "Game Started",
      description: "Use arrow keys to move blocks. Space to drop.",
    });
  }, [randomTetromino, toast]);
  
  // Display the game board with current piece
  const renderBoard = () => {
    // Create a copy of the current board
    const displayBoard = board.map(row => [...row]);
    
    // Render the current piece on the display board
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== EMPTY_CELL) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            
            // Only render if within bounds
            if (boardY >= 0 && boardY < BOARD_HEIGHT && 
                boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.key;
            }
          }
        });
      });
    }
    
    return displayBoard;
  };
  
  // Initialize game
  useEffect(() => {
    startGame();
    
    const handleKeyDown = (e) => {
      if (gameOver || isPaused) return;
      
      // Basic controls (simplified for demo)
      switch (e.key) {
        case 'ArrowLeft':
          // Move left logic would go here
          break;
        case 'ArrowRight':
          // Move right logic would go here
          break;
        case 'ArrowDown':
          // Move down logic would go here
          break;
        case 'ArrowUp':
          // Rotate logic would go here
          break;
        case ' ':
          // Hard drop logic would go here
          break;
        case 'p':
          setIsPaused(!isPaused);
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver, isPaused, startGame]);
  
  // Render the display board
  const boardDisplay = renderBoard();
  
  return (
    <Layout>
      <div className="py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Tetris Effect</h1>
        <p className="text-center text-gray-600 mb-8">
          A beautiful, immersive version of the classic game with calming visuals.
          <br/>Use arrow keys to move, up arrow to rotate, and space to drop pieces.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Game Info Panel */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-calm-lavender/50 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Score</h2>
              <p className="text-2xl font-mono text-calm-purple">{score}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Level</h2>
              <p className="text-2xl font-mono text-calm-purple">{level}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Next Piece</h2>
              <div className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                {/* Next piece preview would go here */}
                <div className="text-gray-400">Preview</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={startGame}
                className="w-full bg-calm-purple text-white px-4 py-2 rounded-lg hover:bg-calm-purple/90 transition-colors"
              >
                New Game
              </button>
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className="w-full border border-calm-purple text-calm-purple px-4 py-2 rounded-lg hover:bg-calm-purple/10 transition-colors"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>
          
          {/* Game Board */}
          <div className="col-span-2">
            <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-calm-lavender/50 p-4 overflow-hidden">
              {/* Game overlay messages */}
              {gameOver && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10">
                  <h2 className="text-white text-2xl font-bold mb-4">Game Over</h2>
                  <p className="text-white mb-4">Your score: {score}</p>
                  <button 
                    onClick={startGame}
                    className="bg-calm-purple text-white px-6 py-2 rounded-lg hover:bg-calm-purple/90 transition-colors"
                  >
                    Play Again
                  </button>
                </div>
              )}
              
              {isPaused && !gameOver && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <h2 className="text-white text-2xl font-bold">Paused</h2>
                </div>
              )}
              
              {/* The game board grid */}
              <div 
                className="grid gap-px bg-gray-200 border-2 border-gray-300 rounded"
                style={{ 
                  gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
                  aspectRatio: `${BOARD_WIDTH}/${BOARD_HEIGHT}`
                }}
              >
                {boardDisplay.flat().map((cell, index) => (
                  <div 
                    key={index} 
                    className={`${cell !== EMPTY_CELL ? TETROMINOES[cell].color : 'bg-gray-100'} 
                               aspect-square rounded-sm shadow-inner`}
                  />
                ))}
              </div>
            </div>
            
            <div className="mt-4 text-center text-gray-600 text-sm">
              <p>Use arrow keys to move and rotate. Space to drop pieces.</p>
              <p>Press 'P' to pause the game.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TetrisEffect;
