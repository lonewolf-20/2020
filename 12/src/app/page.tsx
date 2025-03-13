'use client'

import React, { useState } from 'react';
import { GameProvider } from '@/lib/contexts/GameContext';
import GameContainer from '@/components/GameContainer';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  
  const startGame = () => {
    setGameStarted(true);
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-black text-white">
      {!gameStarted ? (
        <div className="w-full max-w-3xl mx-auto text-center py-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-green-400">WASTELAND GARDENS</h1>
          <p className="text-xl mb-8 text-gray-300">Survive. Farm. Rebuild.</p>
          
          <div className="bg-gray-900 p-6 rounded-lg mb-8 text-left">
            <h2 className="text-2xl font-semibold mb-4 text-center">The Last Hope</h2>
            <p className="mb-4">
              The nuclear holocaust has devastated the surface of Earth. The few survivors have retreated underground,
              creating a network of bunkers where they struggle to survive using hydroponic farming.
            </p>
            <p className="mb-4">
              As one of these survivors, your mission is to maintain your underground farm while venturing to the surface
              to build and maintain solar panels that provide the energy needed for your community.
            </p>
            <p className="mb-4">
              The surface is hazardous - radiation levels are high and you'll need proper equipment to survive. 
              Visit the marketplace to trade resources and buy essential gear.
            </p>
            <p>
              Can you balance the dangers of the surface with the needs of your underground sanctuary? 
              The future of humanity depends on your success!
            </p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">How To Play</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Controls</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>WASD or Arrow Keys to move</li>
                  <li>F to toggle farming controls</li>
                  <li>S to toggle solar controls</li>
                  <li>ESC to pause the game</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">Tips</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Always wear a mask on the surface</li>
                  <li>Monitor your oxygen when above ground</li>
                  <li>Plant crops to earn money</li>
                  <li>Build solar panels for energy</li>
                </ul>
              </div>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-xl transition duration-200"
          >
            Start Game
          </button>
        </div>
      ) : (
        <GameProvider>
          <GameContainer />
        </GameProvider>
      )}
    </main>
  );
}
