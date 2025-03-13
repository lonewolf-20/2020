import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '@/lib/contexts/GameContext';
import Image from 'next/image';

interface GameEngineProps {
  width: number;
  height: number;
}

const GameEngine: React.FC<GameEngineProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isKeyPressed, setIsKeyPressed] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  
  const {
    character,
    time,
    crops,
    solarPanels,
    radiationLevel,
    movePlayer,
    isGamePaused,
  } = useGame();
  
  // Load game images
  const [images, setImages] = useState<Record<string, HTMLImageElement>>({});
  
  useEffect(() => {
    const imageSources = {
      player: '/images/player.png',
      playerWithMask: '/images/player_with_mask.png',
      undergroundTile: '/images/underground_tile.png',
      abovegroundTile: '/images/aboveground_tile.png',
      solarPanel: '/images/solar_panel_placed.png',
      tomatoSeed: '/images/tomato_seed.png',
      lettuceSeed: '/images/lettuce_seed.png',
      tomatoCrop: '/images/tomato_crop.png',
      lettuceCrop: '/images/lettuce_crop.png',
      market: '/images/market.png',
      elevator: '/images/elevator.png',
    };
    
    const loadedImages: Record<string, HTMLImageElement> = {};
    
    Object.entries(imageSources).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      loadedImages[key] = img;
    });
    
    setImages(loadedImages);
  }, []);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGamePaused) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          setIsKeyPressed((prev) => ({ ...prev, up: true }));
          break;
        case 'ArrowDown':
        case 's':
          setIsKeyPressed((prev) => ({ ...prev, down: true }));
          break;
        case 'ArrowLeft':
        case 'a':
          setIsKeyPressed((prev) => ({ ...prev, left: true }));
          break;
        case 'ArrowRight':
        case 'd':
          setIsKeyPressed((prev) => ({ ...prev, right: true }));
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          setIsKeyPressed((prev) => ({ ...prev, up: false }));
          break;
        case 'ArrowDown':
        case 's':
          setIsKeyPressed((prev) => ({ ...prev, down: false }));
          break;
        case 'ArrowLeft':
        case 'a':
          setIsKeyPressed((prev) => ({ ...prev, left: false }));
          break;
        case 'ArrowRight':
        case 'd':
          setIsKeyPressed((prev) => ({ ...prev, right: false }));
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isGamePaused]);
  
  // Handle movement based on keys pressed
  useEffect(() => {
    if (isGamePaused) return;
    
    const moveInterval = setInterval(() => {
      if (isKeyPressed.up) movePlayer('up');
      if (isKeyPressed.down) movePlayer('down');
      if (isKeyPressed.left) movePlayer('left');
      if (isKeyPressed.right) movePlayer('right');
    }, 50);
    
    return () => clearInterval(moveInterval);
  }, [isKeyPressed, movePlayer, isGamePaused]);
  
  // Render the game
  useEffect(() => {
    if (!canvasRef.current || Object.keys(images).length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw background based on level
      const tileSize = 32;
      const backgroundImage = character.currentLevel === 'underground' 
        ? images.undergroundTile 
        : images.abovegroundTile;
      
      // Draw tiled background
      if (backgroundImage) {
        for (let x = 0; x < width; x += tileSize) {
          for (let y = 0; y < height; y += tileSize) {
            ctx.drawImage(backgroundImage, x, y, tileSize, tileSize);
          }
        }
      }
      
      // Draw elevator (level transition point)
      if (images.elevator) {
        ctx.drawImage(images.elevator, width / 2 - 32, height / 2 - 32, 64, 64);
      }
      
      // Draw marketplace if above ground
      if (character.currentLevel === 'aboveground' && images.market) {
        ctx.drawImage(images.market, width - 150, 50, 100, 100);
      }
      
      // Draw crops if underground
      if (character.currentLevel === 'underground') {
        crops.forEach((crop) => {
          const cropImage = crop.type === 'tomato' ? images.tomatoCrop : images.lettuceCrop;
          if (cropImage) {
            ctx.drawImage(cropImage, crop.position.x, crop.position.y, 32, 32);
            
            // Draw growth indicator
            ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
            const growthHeight = (crop.growth / 100) * 5;
            ctx.fillRect(crop.position.x, crop.position.y - 10, growthHeight, 5);
          }
        });
      }
      
      // Draw solar panels if above ground
      if (character.currentLevel === 'aboveground' && images.solarPanel) {
        solarPanels.forEach((panel) => {
          ctx.drawImage(images.solarPanel, panel.position.x, panel.position.y, 48, 48);
        });
      }
      
      // Draw radiation effect if above ground
      if (character.currentLevel === 'aboveground') {
        ctx.fillStyle = `rgba(255, 255, 0, ${radiationLevel / 200})`;
        ctx.fillRect(0, 0, width, height);
      }
      
      // Draw player
      const playerImage = character.wearingMask ? images.playerWithMask : images.player;
      if (playerImage) {
        ctx.drawImage(playerImage, character.position.x, character.position.y, 32, 48);
      }
      
      // Draw time of day
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(
        `Day ${time.day}, ${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`,
        20,
        30
      );
      
      // Draw HUD
      drawHUD(ctx);
    };
    
    const drawHUD = (ctx: CanvasRenderingContext2D) => {
      // Energy bar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(20, height - 60, 150, 20);
      ctx.fillStyle = 'yellow';
      ctx.fillRect(20, height - 60, (character.energy / character.maxEnergy) * 150, 20);
      ctx.strokeStyle = 'white';
      ctx.strokeRect(20, height - 60, 150, 20);
      ctx.fillStyle = 'white';
      ctx.fillText(`Energy: ${Math.floor(character.energy)}/${character.maxEnergy}`, 30, height - 45);
      
      // Oxygen bar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(20, height - 90, 150, 20);
      ctx.fillStyle = 'lightblue';
      ctx.fillRect(20, height - 90, (character.oxygen / character.maxOxygen) * 150, 20);
      ctx.strokeStyle = 'white';
      ctx.strokeRect(20, height - 90, 150, 20);
      ctx.fillStyle = 'white';
      ctx.fillText(`Oxygen: ${Math.floor(character.oxygen)}/${character.maxOxygen}`, 30, height - 75);
      
      // Experience and level
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(width - 170, 20, 150, 20);
      ctx.fillStyle = 'green';
      const experienceThreshold = character.level * 100;
      ctx.fillRect(width - 170, 20, (character.experience / experienceThreshold) * 150, 20);
      ctx.strokeStyle = 'white';
      ctx.strokeRect(width - 170, 20, 150, 20);
      ctx.fillStyle = 'white';
      ctx.fillText(`Level ${character.level} - ${character.experience}/${experienceThreshold} XP`, width - 160, 35);
      
      // Money
      ctx.fillStyle = 'white';
      ctx.fillText(`$${character.money}`, width - 70, 60);
      
      // Current level indicator
      ctx.fillText(
        `Location: ${character.currentLevel === 'underground' ? 'Underground' : 'Aboveground'}`,
        width / 2 - 80,
        30
      );
    };
    
    const animationId = requestAnimationFrame(render);
    
    return () => cancelAnimationFrame(animationId);
  }, [
    width,
    height,
    character,
    time,
    crops,
    solarPanels,
    radiationLevel,
    images,
    isGamePaused,
  ]);
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border-4 border-gray-800 rounded-md shadow-lg"
      />
      
      {isGamePaused && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10"
        >
          <div className="bg-gray-800 p-6 rounded-lg text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Game Paused</h2>
            <p>Press ESC to continue</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameEngine; 