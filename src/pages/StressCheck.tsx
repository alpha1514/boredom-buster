
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { BrainCircuit, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: number;
  text: string;
}

interface Answer {
  questionId: number;
  value: number;
}

const questions: Question[] = [
  { id: 1, text: "How often have you felt nervous or stressed in the last week?" },
  { id: 2, text: "How often have you found that you could not cope with all the things you had to do?" },
  { id: 3, text: "How often have you felt confident about your ability to handle personal problems?" },
  { id: 4, text: "How often have you felt that things were going your way?" },
  { id: 5, text: "How difficult is it for you to relax when you want to?" },
  { id: 6, text: "How often do you experience physical symptoms of stress (like headaches, tension, etc.)?" },
  { id: 7, text: "How well have you been sleeping lately?" },
  { id: 8, text: "How often do you feel overwhelmed by your responsibilities?" },
  { id: 9, text: "How often do you feel irritable or short-tempered?" },
  { id: 10, text: "How would you rate your overall ability to manage stress right now?" },
];

const StressCheck = () => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentStep, setCurrentStep] = useState(0); // 0 = intro, 1-10 = questions, 11 = results
  const [stressScore, setStressScore] = useState(0);

  const handleAnswer = (questionId: number, value: number) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex].value = value;
    } else {
      newAnswers.push({ questionId, value });
    }
    
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    // If we're on a question and haven't answered it yet, show a message
    if (currentStep >= 1 && currentStep <= 10) {
      const questionId = questions[currentStep - 1].id;
      if (!answers.some(a => a.questionId === questionId)) {
        toast("Please answer the question", {
          description: "Select one of the options to continue.",
        });
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
    
    // Calculate results when moving to results page
    if (currentStep === 10) {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleStartOver = () => {
    setCurrentStep(0);
    setAnswers([]);
    setStressScore(0);
  };

  const calculateResults = () => {
    let score = 0;
    const totalQuestions = questions.length;
    
    // Calculate raw score (0-40)
    for (const answer of answers) {
      // Questions 3, 4, and 10 are reverse scored (higher is better)
      if ([3, 4, 10].includes(answer.questionId)) {
        score += 5 - answer.value; // Reverse the score
      } else {
        score += answer.value;
      }
    }
    
    // Normalize to 0-100 scale
    const normalizedScore = Math.round((score / (totalQuestions * 4)) * 100);
    setStressScore(normalizedScore);
  };

  const getStressLevel = () => {
    if (stressScore < 30) return { level: "Low", color: "text-green-500", message: "You're managing stress well!" };
    if (stressScore < 60) return { level: "Moderate", color: "text-yellow-500", message: "You're experiencing some stress." };
    if (stressScore < 80) return { level: "High", color: "text-orange-500", message: "Your stress levels are concerning." };
    return { level: "Severe", color: "text-red-500", message: "Your stress levels are very high." };
  };

  const getRecommendations = () => {
    const { level } = getStressLevel();
    
    switch (level) {
      case "Low":
        return [
          "Keep up your current stress management practices",
          "Continue with regular relaxation activities",
          "Maintain your social connections and support network"
        ];
      case "Moderate":
        return [
          "Try adding 10 minutes of daily meditation",
          "Ensure you're getting enough sleep (7-8 hours)",
          "Take short breaks throughout your day to reset",
          "Play some relaxing games on our site!"
        ];
      case "High":
        return [
          "Consider speaking with a mental health professional",
          "Practice deep breathing exercises several times daily",
          "Reduce commitments where possible",
          "Spend time in nature regularly",
          "Try our calming games to give your mind a break"
        ];
      case "Severe":
        return [
          "Consult with a healthcare provider soon",
          "Prioritize self-care activities daily",
          "Practice mindfulness or meditation",
          "Reduce caffeine and improve sleep hygiene",
          "Consider what obligations you can pause or delegate",
          "Use our games as quick mental breaks"
        ];
    }
  };

  const renderContent = () => {
    // Intro page
    if (currentStep === 0) {
      return (
        <div className="text-center">
          <BrainCircuit size={64} className="mx-auto text-calm-purple mb-6" />
          <h2 className="text-2xl font-bold mb-4">Stress Level Assessment</h2>
          <p className="mb-6 text-gray-600">
            This quick 10-question assessment will help you understand your current stress levels.
            Answer honestly for the most accurate results.
          </p>
          <Button onClick={handleNext} className="btn-calm">
            Start Assessment
          </Button>
        </div>
      );
    }
    
    // Questions
    if (currentStep >= 1 && currentStep <= 10) {
      const question = questions[currentStep - 1];
      const currentAnswer = answers.find(a => a.questionId === question.id);
      
      return (
        <div>
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Question {currentStep} of 10</span>
              <span>{Math.round((currentStep / 10) * 100)}% Complete</span>
            </div>
            <Progress value={currentStep * 10} className="h-2" />
          </div>
          
          <h2 className="text-xl font-semibold mb-6">{question.text}</h2>
          
          <RadioGroup 
            value={currentAnswer ? currentAnswer.value.toString() : undefined}
            onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="r1" />
              <Label htmlFor="r1">Never / Not at all</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="r2" />
              <Label htmlFor="r2">Rarely / A little</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="r3" />
              <Label htmlFor="r3">Sometimes / Somewhat</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="r4" />
              <Label htmlFor="r4">Often / Quite a bit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="r5" />
              <Label htmlFor="r5">Always / Extremely</Label>
            </div>
          </RadioGroup>
          
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep === 10 ? "See Results" : "Next"}
            </Button>
          </div>
        </div>
      );
    }
    
    // Results
    if (currentStep === 11) {
      const { level, color, message } = getStressLevel();
      const recommendations = getRecommendations();
      
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Your Stress Assessment Results</h2>
          
          <div className="mb-8">
            <p className="text-center mb-2">Your stress level is:</p>
            <p className={`text-center text-3xl font-bold mb-4 ${color}`}>{level}</p>
            <div className="relative pt-1 mb-6">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-green-600 bg-green-200">
                    Low
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-yellow-600 bg-yellow-200">
                    Moderate
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-orange-600 bg-orange-200">
                    High
                  </span>
                </div>
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full text-red-600 bg-red-200">
                    Severe
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div 
                  style={{ width: `${stressScore}%` }} 
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    stressScore < 30 ? 'bg-green-500' : 
                    stressScore < 60 ? 'bg-yellow-500' : 
                    stressScore < 80 ? 'bg-orange-500' : 
                    'bg-red-500'
                  }`}
                ></div>
              </div>
            </div>
            <p className="text-center mb-6">{message}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h3 className="font-semibold mb-4">Recommendations:</h3>
            <ul className="space-y-2">
              {recommendations?.map((rec, i) => (
                <li key={i} className="flex items-start">
                  <span className="mr-2 text-calm-purple">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
            <Button onClick={handleStartOver} variant="outline" className="flex items-center">
              <RefreshCcw size={16} className="mr-2" />
              Take Assessment Again
            </Button>
            <Button onClick={() => window.location.href = "/games"} className="bg-calm-purple hover:bg-calm-purple/90">
              Play a Relaxing Game
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <Layout>
      <div className="py-8 max-w-xl mx-auto">
        <div className="card-game">
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default StressCheck;
