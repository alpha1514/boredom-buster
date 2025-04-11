
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '../components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw } from 'lucide-react';

// Define tetromino shapes and colors
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
const EMPTY_CELL = null;
const INITIAL_SPEED = 1000; // ms

const TetrisEffect = () => {
  const { toast } = useToast();
  const [board, setBoard] = useState<(string | null)[][]>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][];
    color: string;
    key: string;
  } | null>(null);
  const [nextPiece, setNextPiece] = useState<{
    shape: number[][];
    color: string;
    key: string;
  } | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const dropCounterRef = useRef<number>(0);
  
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
      shape: [...TETROMINOES[tetroKey].shape], // Create a deep copy
      color: TETROMINOES[tetroKey].color,
      key: tetroKey
    };
  }, []);
  
  // Check for collision
  const checkCollision = useCallback((piece, posX, posY) => {
    if (!piece) return true;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        // Skip empty cells in the tetromino
        if (piece.shape[y][x] === 0) continue;
        
        const boardX = posX + x;
        const boardY = posY + y;
        
        // Check boundaries
        if (
          boardX < 0 || 
          boardX >= BOARD_WIDTH || 
          boardY >= BOARD_HEIGHT
        ) {
          return true;
        }
        
        // Check if we're above the top boundary (valid for placement)
        if (boardY < 0) continue;
        
        // Check collision with placed pieces
        if (board[boardY][boardX] !== EMPTY_CELL) {
          return true;
        }
      }
    }
    
    return false;
  }, [board]);
  
  // Rotate tetromino
  const rotatePiece = useCallback(() => {
    if (!currentPiece) return;
    
    // Create a rotated version of the current piece
    const rotated = {
      ...currentPiece,
      shape: currentPiece.shape[0].map((_, index) =>
        currentPiece.shape.map(row => row[index]).reverse()
      )
    };
    
    // Only set if there's no collision
    if (!checkCollision(rotated, position.x, position.y)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, position, checkCollision]);
  
  // Move tetromino
  const movePiece = useCallback((direction) => {
    if (!currentPiece || gameOver || isPaused) return;
    
    let newX = position.x;
    let newY = position.y;
    
    switch (direction) {
      case 'left':
        newX -= 1;
        break;
      case 'right':
        newX += 1;
        break;
      case 'down':
        newY += 1;
        break;
      default:
        break;
    }
    
    // Check if move is valid
    if (!checkCollision(currentPiece, newX, newY)) {
      setPosition({ x: newX, y: newY });
      return true;
    }
    
    // If moving down causes collision, place the piece
    if (direction === 'down') {
      placePiece();
      return false;
    }
    
    return false;
  }, [currentPiece, position, gameOver, isPaused, checkCollision]);
  
  // Place piece on the board
  const placePiece = useCallback(() => {
    if (!currentPiece) return;
    
    // Create a new board with the current piece placed
    const newBoard = [...board.map(row => [...row])];
    
    currentPiece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          const boardY = position.y + y;
          if (boardY >= 0) { // Only place if it's on the board
            const boardX = position.x + x;
            newBoard[boardY][boardX] = currentPiece.key;
          }
        }
      });
    });
    
    // Check if game over (piece placed above the visible area)
    if (position.y < 0) {
      setGameOver(true);
      toast({
        title: "Game Over",
        description: `Your score: ${score}. Try again!`,
      });
      return;
    }
    
    // Add to score and clear lines
    const { clearedBoard, linesCleared } = clearLines(newBoard);
    setBoard(clearedBoard);
    
    // Update score based on lines cleared
    if (linesCleared > 0) {
      const points = [0, 100, 300, 500, 800][linesCleared] * level;
      setScore(prevScore => prevScore + points);
      
      // Update level every 10 lines
      const newLinesTotal = linesCleared;
      if (newLinesTotal >= 10) {
        const newLevel = level + 1;
        setLevel(newLevel);
        setSpeed(INITIAL_SPEED - (newLevel - 1) * 100);
        toast({
          title: `Level ${newLevel}!`,
          description: "Speed increased!",
        });
      }
    }
    
    // Generate the next piece
    generateNewPiece();
  }, [board, currentPiece, position, score, level, toast]);
  
  // Clear completed lines
  const clearLines = useCallback((board) => {
    let linesCleared = 0;
    const newBoard = board.filter((row) => {
      const isLineFull = row.every(cell => cell !== EMPTY_CELL);
      if (isLineFull) {
        linesCleared++;
        return false;
      }
      return true;
    });
    
    // Add new empty lines at the top
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(EMPTY_CELL));
    }
    
    return { clearedBoard: newBoard, linesCleared };
  }, []);
  
  // Generate a new piece
  const generateNewPiece = useCallback(() => {
    if (nextPiece) {
      setCurrentPiece(nextPiece);
    } else {
      setCurrentPiece(randomTetromino());
    }
    
    setNextPiece(randomTetromino());
    
    // Reset position to top center
    setPosition({
      x: Math.floor(BOARD_WIDTH / 2) - 1, 
      y: -2 // Start above the board so it appears gradually
    });
  }, [nextPiece, randomTetromino]);
  
  // Hard drop the current piece
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    let newY = position.y;
    while (!checkCollision(currentPiece, position.x, newY + 1)) {
      newY++;
    }
    
    setPosition({ ...position, y: newY });
    placePiece();
  }, [currentPiece, position, gameOver, isPaused, checkCollision, placePiece]);
  
  // Start new game
  const startGame = useCallback(() => {
    // Reset the game state
    setBoard(createEmptyBoard());
    setScore(0);
    setLevel(1);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setIsPaused(false);
    
    // Generate initial pieces
    const initial = randomTetromino();
    const next = randomTetromino();
    
    setCurrentPiece(initial);
    setNextPiece(next);
    
    // Place the tetromino at the top center of the board
    setPosition({
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: -2
    });
    
    toast({
      title: "Game Started",
      description: "Use arrow keys to move, Space to drop.",
    });
  }, [randomTetromino, toast]);
  
  // Game loop
  const gameLoop = useCallback((time) => {
    if (gameOver || isPaused) {
      lastTimeRef.current = 0;
      dropCounterRef.current = 0;
      return;
    }
    
    const deltaTime = time - (lastTimeRef.current || time);
    lastTimeRef.current = time;
    
    dropCounterRef.current += deltaTime;
    
    if (dropCounterRef.current > speed) {
      movePiece('down');
      dropCounterRef.current = 0;
    }
    
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [gameOver, isPaused, speed, movePiece]);
  
  // Start and stop game loop
  useEffect(() => {
    if (!gameOver && !isPaused) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameOver, isPaused, gameLoop]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      
      if (e.key === 'p') {
        setIsPaused(prev => !prev);
        return;
      }
      
      if (isPaused) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          movePiece('left');
          break;
        case 'ArrowRight':
          movePiece('right');
          break;
        case 'ArrowDown':
          movePiece('down');
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        case ' ':
          hardDrop();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver, isPaused, movePiece, rotatePiece, hardDrop]);
  
  // Initialize game
  useEffect(() => {
    startGame();
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [startGame]);
  
  // Render next piece preview
  const renderNextPiece = () => {
    if (!nextPiece) return null;
    
    return (
      <div className="grid gap-px" style={{ 
        gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1fr)`,
      }}>
        {nextPiece.shape.map((row, y) => 
          row.map((cell, x) => (
            <div 
              key={`next-${y}-${x}`} 
              className={`${cell !== 0 ? nextPiece.color : 'bg-transparent'} 
                         w-5 h-5 rounded-sm`}
            />
          ))
        )}
      </div>
    );
  };
  
  // Render the game board
  const renderBoard = () => {
    // Create a copy of the current board
    const displayBoard = board.map(row => [...row]);
    
    // Add the current piece to the display board
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell !== 0) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            
            // Only render if within bounds
            if (
              boardY >= 0 && boardY < BOARD_HEIGHT && 
              boardX >= 0 && boardX < BOARD_WIDTH
            ) {
              displayBoard[boardY][boardX] = currentPiece.key;
            }
          }
        });
      });
    }
    
    return displayBoard;
  };
  
  const boardDisplay = renderBoard();
  
  // Handle touch controls
  const handleTouchControl = (direction) => {
    if (direction === 'rotate') {
      rotatePiece();
    } else if (direction === 'drop') {
      hardDrop();
    } else {
      movePiece(direction);
    }
  };
  
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
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4">
                {nextPiece ? renderNextPiece() : <div className="text-gray-400">Preview</div>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={startGame}
                className="w-full bg-calm-purple text-white"
              >
                New Game
              </Button>
              <Button 
                onClick={() => setIsPaused(!isPaused)}
                variant="outline"
                className="w-full border border-calm-purple text-calm-purple"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
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
                  <Button 
                    onClick={startGame}
                    className="bg-calm-purple text-white"
                  >
                    Play Again
                  </Button>
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
            
            {/* Touch controls for mobile */}
            <div className="mt-6 grid grid-cols-3 gap-2 md:hidden">
              <div className="flex justify-center">
                <Button onClick={() => handleTouchControl('left')} variant="outline">
                  <ArrowLeft />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-center">
                  <Button onClick={() => handleTouchControl('rotate')} variant="outline">
                    <RotateCcw />
                  </Button>
                </div>
                <div className="flex justify-center">
                  <Button onClick={() => handleTouchControl('down')} variant="outline">
                    <ArrowDown />
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <Button onClick={() => handleTouchControl('right')} variant="outline">
                  <ArrowRight />
                </Button>
              </div>
              
              <div className="col-span-3 mt-2 flex justify-center">
                <Button onClick={() => handleTouchControl('drop')} className="w-full bg-calm-purple">
                  Drop
                </Button>
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
