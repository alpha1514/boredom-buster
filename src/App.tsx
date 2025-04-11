
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GamesPage from "./pages/GamesPage";
import TicTacToe from "./games/TicTacToe";
import Sudoku from "./games/Sudoku";
import TetrisEffect from "./games/TetrisEffect";
import MonumentValley from "./games/MonumentValley";
import Unpacking from "./games/Unpacking";
import StressCheck from "./pages/StressCheck";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/games/sudoku" element={<Sudoku />} />
          <Route path="/games/tetris-effect" element={<TetrisEffect />} />
          <Route path="/games/monument-valley" element={<MonumentValley />} />
          <Route path="/games/unpacking" element={<Unpacking />} />
          <Route path="/stress-check" element={<StressCheck />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
