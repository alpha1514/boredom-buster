
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X, Circle, RotateCcw } from 'lucide-react';

type Player = 'X' | 'O' | null;
type Board = (Player)[][];

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>([
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]);
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState(false);

  const checkWinner = (board: Board): Player => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
        return board[i][0];
      }
    }

    // Check columns
    for (let j = 0; j < 3; j++) {
      if (board[0][j] && board[0][j] === board[1][j] && board[0][j] === board[2][j]) {
        return board[0][j];
      }
    }

    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
      return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
      return board[0][2];
    }

    return null;
  };

  const checkDraw = (board: Board): boolean => {
    // If there's a winner, it's not a draw
    if (checkWinner(board)) {
      return false;
    }
    
    // Check if board is full
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === null) {
          return false;
        }
      }
    }
    
    return true;
  };

  const handleClick = (row: number, col: number) => {
    if (board[row][col] || winner || isDraw) {
      return;
    }

    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      toast(`${gameWinner} wins!`, {
        description: "Congratulations on your victory!",
      });
      return;
    }

    if (checkDraw(newBoard)) {
      setIsDraw(true);
      toast("It's a draw!", {
        description: "Great minds think alike!",
      });
      return;
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const resetGame = () => {
    setBoard([
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]);
    setCurrentPlayer('X');
    setWinner(null);
    setIsDraw(false);
  };

  return (
    <Layout>
      <div className="py-8 max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Tic Tac Toe</h1>
        <p className="text-center text-gray-600 mb-8">
          A classic game to exercise your strategic thinking. Play against a friend!
        </p>

        <div className="card-game mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 font-medium">Current Player:</span>
              <div className={`p-2 rounded ${currentPlayer === 'X' ? 'bg-calm-lavender/20 text-calm-purple' : 'bg-calm-blue/20 text-blue-500'}`}>
                {currentPlayer === 'X' ? <X size={20} /> : <Circle size={20} />}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetGame}
              className="flex items-center space-x-1"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {board.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleClick(rowIndex, colIndex)}
                  disabled={!!cell || !!winner || isDraw}
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-200 
                    ${!cell && !winner && !isDraw ? 'hover:bg-gray-100' : ''} 
                    ${cell === 'X' ? 'bg-calm-lavender/20 text-calm-purple' : cell === 'O' ? 'bg-calm-blue/20 text-blue-500' : 'bg-gray-50'}`}
                >
                  {cell === 'X' ? <X size={36} /> : cell === 'O' ? <Circle size={36} /> : ''}
                </button>
              ))
            ))}
          </div>

          {(winner || isDraw) && (
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              {winner ? (
                <p className="text-lg font-medium">
                  <span className={`${winner === 'X' ? 'text-calm-purple' : 'text-blue-500'} font-bold`}>
                    {winner}
                  </span> wins!
                </p>
              ) : (
                <p className="text-lg font-medium">It's a draw!</p>
              )}
              <Button onClick={resetGame} className="mt-2 bg-calm-purple hover:bg-calm-purple/90">
                Play Again
              </Button>
            </div>
          )}
        </div>

        <div className="bg-calm-yellow/20 p-4 rounded-lg text-sm text-gray-600">
          <h3 className="font-medium mb-2">How to Play:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Take turns placing your mark (X or O) on the grid</li>
            <li>Get three of your marks in a row (horizontally, vertically, or diagonally) to win</li>
            <li>If the grid fills up with no winner, the game ends in a draw</li>
          </ol>
        </div>
      </div>
    </Layout>
  );
};

export default TicTacToe;
