import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { AlertCircle, RotateCcw, Check } from 'lucide-react';

type SudokuGrid = (number | null)[][];

interface SudokuGameState {
  original: SudokuGrid;
  current: SudokuGrid;
  selected: { row: number; col: number } | null;
  isComplete: boolean;
  isValid: boolean;
}

const Sudoku = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameState, setGameState] = useState<SudokuGameState>({
    original: Array(9).fill(null).map(() => Array(9).fill(null)),
    current: Array(9).fill(null).map(() => Array(9).fill(null)),
    selected: null,
    isComplete: false,
    isValid: true
  });

  // Initialize game on mount or when difficulty changes
  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const initializeGame = () => {
    const { grid, solution } = generateSudoku(difficulty);
    
    setGameState({
      original: grid,
      current: JSON.parse(JSON.stringify(grid)),
      selected: null,
      isComplete: false,
      isValid: true
    });
  };

  // Simplified Sudoku generator for demo purposes
  // In a real implementation, you would want a more sophisticated algorithm
  const generateSudoku = (difficulty: 'easy' | 'medium' | 'hard') => {
    // This is a simplified version for demonstration
    // It creates a partially filled grid based on difficulty
    
    // Start with a solved grid (this would be a valid Sudoku solution)
    const solution = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];
    
    // Create a copy to remove some numbers based on difficulty
    const grid = JSON.parse(JSON.stringify(solution));
    
    // Determine how many cells to keep visible
    const cellsToKeep = 
      difficulty === 'easy' ? 45 :
      difficulty === 'medium' ? 35 : 25;
    
    // Calculate how many to remove
    const cellsToRemove = 81 - cellsToKeep;
    
    // Remove random cells
    let removed = 0;
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (grid[row][col] !== null) {
        grid[row][col] = null;
        removed++;
      }
    }
    
    return { grid, solution };
  };

  const handleCellClick = (row: number, col: number) => {
    // Only allow selection of empty cells or user-filled cells (not original puzzle cells)
    if (gameState.original[row][col] === null) {
      setGameState(prev => ({
        ...prev,
        selected: { row, col }
      }));
    }
  };

  const handleNumberInput = (number: number) => {
    if (!gameState.selected) return;
    
    const { row, col } = gameState.selected;
    
    // Update current grid
    const newCurrent = JSON.parse(JSON.stringify(gameState.current));
    newCurrent[row][col] = number;
    
    // Check if the grid is complete and valid
    const isComplete = isGridFilled(newCurrent);
    const isValid = validateGrid(newCurrent);
    
    setGameState(prev => ({
      ...prev,
      current: newCurrent,
      isComplete,
      isValid
    }));
    
    // If game is complete and valid, show success message
    if (isComplete && isValid) {
      toast("Congratulations!", {
        description: "You've successfully completed the Sudoku puzzle!",
      });
    } else if (!isValid) {
      // Show error toast if the placement is invalid
      toast("Invalid move", {
        description: "This number conflicts with existing numbers",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      });
    }
  };

  const handleClearCell = () => {
    if (!gameState.selected) return;
    
    const { row, col } = gameState.selected;
    
    // Only clear if it's not an original cell
    if (gameState.original[row][col] === null) {
      const newCurrent = JSON.parse(JSON.stringify(gameState.current));
      newCurrent[row][col] = null;
      
      setGameState(prev => ({
        ...prev,
        current: newCurrent,
        isComplete: false
      }));
    }
  };

  const isGridFilled = (grid: SudokuGrid): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === null) {
          return false;
        }
      }
    }
    return true;
  };

  const validateGrid = (grid: SudokuGrid): boolean => {
    // This is a simplified validation that doesn't check the entire grid
    // Just checks if the last placement is valid
    
    if (!gameState.selected) return true;
    
    const { row, col } = gameState.selected;
    const value = grid[row][col];
    
    if (value === null) return true;
    
    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== col && grid[row][i] === value) {
        return false;
      }
    }
    
    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && grid[i][col] === value) {
        return false;
      }
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const r = boxRow + i;
        const c = boxCol + j;
        if ((r !== row || c !== col) && grid[r][c] === value) {
          return false;
        }
      }
    }
    
    return true;
  };

  const resetGame = () => {
    initializeGame();
  };

  const renderCell = (row: number, col: number) => {
    const value = gameState.current[row][col];
    const isOriginal = gameState.original[row][col] !== null;
    const isSelected = gameState.selected?.row === row && gameState.selected?.col === col;
    
    // Determine cell borders to create the 3x3 box visual effect
    const borderTop = row % 3 === 0 ? 'border-t-2' : '';
    const borderLeft = col % 3 === 0 ? 'border-l-2' : '';
    const borderRight = col === 8 ? 'border-r-2' : '';
    const borderBottom = row === 8 ? 'border-b-2' : '';
    
    return (
      <button
        key={`${row}-${col}`}
        onClick={() => handleCellClick(row, col)}
        disabled={isOriginal}
        className={`
          aspect-square flex items-center justify-center border border-gray-200 
          ${borderTop} ${borderLeft} ${borderRight} ${borderBottom}
          ${isOriginal ? 'bg-gray-100 text-gray-800 font-semibold' : 'bg-white'}
          ${isSelected ? 'bg-calm-lavender/30 border-calm-purple' : ''}
          transition-colors
        `}
      >
        {value !== null ? value : ''}
      </button>
    );
  };

  return (
    <Layout>
      <div className="py-8 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Sudoku</h1>
        <p className="text-center text-gray-600 mb-8">
          Exercise your brain with this classic number puzzle game.
        </p>

        <Tabs defaultValue="easy" onValueChange={(value) => setDifficulty(value as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="easy">Easy</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="hard">Hard</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="card-game mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-600 font-medium">
              {gameState.isComplete && gameState.isValid ? (
                <span className="text-green-600 flex items-center">
                  <Check size={16} className="mr-1" /> Complete!
                </span>
              ) : (
                <span>Keep going...</span>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetGame}
              className="flex items-center space-x-1"
            >
              <RotateCcw size={16} />
              <span>New Game</span>
            </Button>
          </div>

          <div className="border-2 border-gray-400 mb-6">
            <div className="grid grid-cols-9">
              {Array(9).fill(null).map((_, row) => (
                Array(9).fill(null).map((_, col) => renderCell(row, col))
              ))}
            </div>
          </div>

          <div className="grid grid-cols-9 gap-1 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <Button
                key={num}
                variant="outline"
                className="p-0 aspect-square"
                onClick={() => handleNumberInput(num)}
                disabled={!gameState.selected}
              >
                {num}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleClearCell}
            disabled={!gameState.selected || gameState.current[gameState.selected.row][gameState.selected.col] === null}
          >
            Clear
          </Button>
        </div>

        <div className="bg-calm-yellow/20 p-4 rounded-lg text-sm text-gray-600">
          <h3 className="font-medium mb-2">How to Play:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Fill in the grid so that every row, column, and 3×3 box contains the digits 1 through 9</li>
            <li>Click on an empty cell, then use the number buttons to fill it</li>
            <li>You can't change the pre-filled numbers</li>
            <li>The puzzle is complete when all cells are correctly filled</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default Sudoku;
