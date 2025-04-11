
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { Box, Home, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const Unpacking = () => {
  const { toast } = useToast();
  const [unpackedItems, setUnpackedItems] = useState<string[]>([]);
  const [currentBox, setCurrentBox] = useState(1);
  
  const boxes = [
    { id: 1, items: ["Books", "Photo frame", "Lamp", "Notebook"] },
    { id: 2, items: ["Clothes", "Shoes", "Hat", "Scarf"] },
    { id: 3, items: ["Kitchen utensils", "Plates", "Cups", "Cutlery"] },
    { id: 4, items: ["Plant", "Art supplies", "Game console", "Plush toy"] }
  ];

  const handleUnpack = (item: string) => {
    if (!unpackedItems.includes(item)) {
      setUnpackedItems([...unpackedItems, item]);
      toast({
        title: `Unpacked: ${item}`,
        description: "Where would you like to place this?",
      });
    }
  };

  const handleNextBox = () => {
    if (currentBox < boxes.length) {
      setCurrentBox(currentBox + 1);
      toast({
        title: "New box opened!",
        description: "Let's see what's inside...",
      });
    } else {
      toast({
        title: "All unpacked!",
        description: "You've successfully unpacked all your belongings.",
        variant: "default",
      });
    }
  };

  const resetGame = () => {
    setUnpackedItems([]);
    setCurrentBox(1);
    toast({
      title: "Game reset",
      description: "Starting fresh with new boxes to unpack.",
    });
  };

  const currentItems = boxes.find(box => box.id === currentBox)?.items || [];
  const remainingItems = currentItems.filter(item => !unpackedItems.includes(item));
  const progress = Math.round((unpackedItems.length / (currentBox * 4)) * 100);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Unpacking</h1>
          <Link to="/games" className="text-calm-purple hover:underline flex items-center gap-2">
            <Home size={20} />
            Back to Games
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <p className="text-gray-600 mb-4">
            A meditative experience of unpacking boxes and arranging items in your new home. 
            Take your time and enjoy the process of creating your space.
          </p>
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-calm-purple font-medium">Box: {currentBox}/{boxes.length}</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full mt-2">
                <div 
                  className="h-full bg-calm-purple rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <Button onClick={resetGame} variant="outline" className="flex items-center gap-2">
              <RefreshCw size={16} />
              Reset
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-calm-yellow/10 rounded-lg p-4 border border-calm-yellow/20">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Box size={18} className="text-calm-yellow" />
                Current Box
              </h3>
              {remainingItems.length > 0 ? (
                <ul className="space-y-2">
                  {remainingItems.map(item => (
                    <li key={item}>
                      <button
                        onClick={() => handleUnpack(item)}
                        className="w-full text-left p-2 rounded bg-white hover:bg-calm-yellow/20 transition-colors"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  {currentBox < boxes.length ? (
                    <p>Box empty! Ready for the next one.</p>
                  ) : (
                    <p>All boxes unpacked!</p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-calm-blue/10 rounded-lg p-4 border border-calm-blue/20">
              <h3 className="font-medium mb-3">Unpacked Items</h3>
              {unpackedItems.length > 0 ? (
                <ul className="space-y-2">
                  {unpackedItems.map(item => (
                    <li key={item} className="p-2 rounded bg-white shadow-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No items unpacked yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleNextBox} 
              disabled={remainingItems.length > 0 || currentBox >= boxes.length}
            >
              {currentBox >= boxes.length && remainingItems.length === 0 
                ? "All Boxes Unpacked!" 
                : "Next Box"}
            </Button>
          </div>
        </div>

        <div className="bg-white/70 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-calm-purple">How to Play</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Click on items in the box to unpack them one by one</li>
            <li>Each item will be added to your "Unpacked Items" collection</li>
            <li>Empty the current box to move on to the next one</li>
            <li>Take your time and enjoy the meditative process of unpacking</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Unpacking;
