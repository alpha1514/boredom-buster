
import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface Game {
  title: string;
  path: string;
  description: string;
}

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [stressLevel, setStressLevel] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [suggestions, setSuggestions] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    setLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Generate game suggestions based on stress level
      const gameRecommendations = getGameSuggestions(stressLevel, additionalInfo);
      setSuggestions(gameRecommendations);
      setLoading(false);
    }, 1500);
  };

  const getGameSuggestions = (level: string, info: string): Game[] => {
    const allGames: Record<string, Game[]> = {
      low: [
        { title: 'Tic Tac Toe', path: '/games/tic-tac-toe', description: 'A simple game to keep your mind engaged with light strategy.' },
        { title: 'Monument Valley', path: '/games/monument-valley', description: 'A beautiful puzzle game with calming visuals and gentle challenges.' }
      ],
      medium: [
        { title: 'Sudoku', path: '/games/sudoku', description: 'Immerse yourself in number puzzles to shift focus away from stressors.' },
        { title: 'Unpacking', path: '/games/unpacking', description: 'A meditative experience of organizing items can bring a sense of control.' }
      ],
      high: [
        { title: 'Tetris Effect', path: '/games/tetris-effect', description: 'Rhythmic gameplay can help regulate breathing and provide distraction from anxiety.' },
        { title: 'Stress Check', path: '/stress-check', description: 'Before playing, consider taking our stress assessment to track your levels.' }
      ]
    };
    
    let recommendations: Game[] = [];
    
    // Base recommendations on stress level
    switch(level) {
      case 'low':
        recommendations = [...allGames.low];
        break;
      case 'medium':
        recommendations = [...allGames.medium];
        break;
      case 'high':
        recommendations = [...allGames.high];
        break;
      default:
        // Mix of all games if no specific level
        recommendations = [
          allGames.low[0],
          allGames.medium[0],
          allGames.high[0]
        ];
    }
    
    // Adjust based on keywords in additional info
    if (info.toLowerCase().includes('focus') || info.toLowerCase().includes('concentration')) {
      if (!recommendations.some(game => game.title === 'Sudoku')) {
        recommendations.push(allGames.medium[0]);
      }
    }
    
    if (info.toLowerCase().includes('relax') || info.toLowerCase().includes('calm')) {
      if (!recommendations.some(game => game.title === 'Monument Valley')) {
        recommendations.push(allGames.low[1]);
      }
    }
    
    if (info.toLowerCase().includes('distract') || info.toLowerCase().includes('anxiety')) {
      if (!recommendations.some(game => game.title === 'Tetris Effect')) {
        recommendations.push(allGames.high[0]);
      }
    }
    
    return recommendations.slice(0, 3); // Limit to 3 suggestions
  };

  const goToGame = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-5 right-5 rounded-full h-14 w-14 p-3 bg-calm-purple hover:bg-calm-purple/90 shadow-lg">
          <Bot size={24} className="text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot size={20} className="text-calm-purple" />
            Game Assistant
          </DialogTitle>
          <DialogDescription>
            Let me suggest games based on your current stress level.
          </DialogDescription>
        </DialogHeader>
        
        {suggestions.length === 0 ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">How would you describe your current stress level?</h4>
              <RadioGroup value={stressLevel} onValueChange={setStressLevel}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="stress-low" />
                  <Label htmlFor="stress-low">Low - I'm feeling pretty relaxed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="stress-medium" />
                  <Label htmlFor="stress-medium">Medium - I'm a bit tense</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="stress-high" />
                  <Label htmlFor="stress-high">High - I'm very stressed</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additional-info">Tell me more about how you're feeling (optional)</Label>
              <Textarea
                id="additional-info"
                placeholder="I'm looking for something to help me focus..."
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleSubmit} 
              disabled={!stressLevel || loading} 
              className="w-full"
            >
              {loading ? "Thinking..." : "Get Suggestions"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <h4 className="text-sm font-medium">Based on your input, I recommend:</h4>
            <div className="space-y-3">
              {suggestions.map((game, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <h5 className="font-medium text-calm-purple">{game.title}</h5>
                  <p className="text-sm text-gray-600 my-1">{game.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => goToGame(game.path)}
                    className="mt-2"
                  >
                    Play Now
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={() => setSuggestions([])}>
                Try Again
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistant;
