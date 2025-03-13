import React, { useState, useEffect } from 'react';
import { useGame } from '@/lib/contexts/GameContext';
import GameEngine from '@/components/GameEngine';
import GameInterface from '@/components/GameInterface';
import FarmingControls from '@/components/FarmingControls';
import SolarControls from '@/components/SolarControls';

const GameContainer: React.FC = () => {
  const { character, isGamePaused, pauseGame, resumeGame } = useGame();
  const [showFarmingControls, setShowFarmingControls] = useState(false);
  const [showSolarControls, setShowSolarControls] = useState(false);
  
  // Pause game with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isGamePaused) {
          resumeGame();
        } else {
          pauseGame();
        }
      }
      
      // Toggle farming controls with F key
      if (e.key === 'f' && character.currentLevel === 'underground') {
        setShowFarmingControls((prev) => !prev);
      }
      
      // Toggle solar controls with S key
      if (e.key === 's' && character.currentLevel === 'aboveground') {
        setShowSolarControls((prev) => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGamePaused, pauseGame, resumeGame, character.currentLevel]);
  
  // Hide controls when changing levels
  useEffect(() => {
    if (character.currentLevel === 'underground') {
      setShowSolarControls(false);
    } else {
      setShowFarmingControls(false);
    }
  }, [character.currentLevel]);
  
  // Function to start a new game (would reset the game state)
  const startGame = () => {
    // This would reset the game state in a real implementation
    resumeGame();
  };
  
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-white">
          <h1 className="text-2xl font-bold text-green-400">Wasteland Gardens</h1>
          <p className="text-sm text-gray-400">Day {character.level} - Level {character.level}</p>
        </div>
        
        <div className="flex gap-2">
          {character.currentLevel === 'underground' && (
            <button
              onClick={() => setShowFarmingControls(!showFarmingControls)}
              className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
            >
              {showFarmingControls ? 'Hide Farming' : 'Show Farming'} (F)
            </button>
          )}
          
          {character.currentLevel === 'aboveground' && (
            <button
              onClick={() => setShowSolarControls(!showSolarControls)}
              className="bg-yellow-700 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
            >
              {showSolarControls ? 'Hide Solar' : 'Show Solar'} (S)
            </button>
          )}
          
          <button
            onClick={isGamePaused ? resumeGame : pauseGame}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
          >
            {isGamePaused ? 'Resume Game' : 'Pause Game'} (ESC)
          </button>
        </div>
      </div>
      
      <div className="relative">
        <GameEngine width={800} height={500} />
        <FarmingControls isVisible={showFarmingControls} />
        <SolarControls isVisible={showSolarControls} />
        <GameInterface onStartGame={startGame} />
        
        {isGamePaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
            <div className="bg-gray-800 p-6 rounded-lg text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Game Paused</h2>
              <p className="mb-6">Press ESC to continue</p>
              
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-yellow-400">Controls</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>WASD or Arrow Keys to move</li>
                    <li>F to toggle farming controls</li>
                    <li>S to toggle solar panel controls</li>
                    <li>ESC to pause/resume the game</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-yellow-400">Tips</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Always wear a mask on the surface</li>
                    <li>Monitor your oxygen when above ground</li>
                    <li>Sleep at night to recover energy</li>
                    <li>Clean solar panels regularly for efficiency</li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={resumeGame}
                className="mt-6 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
              >
                Resume Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameContainer; 