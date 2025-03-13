import React, { useState } from 'react';
import { useGame } from '@/lib/contexts/GameContext';

interface FarmingControlsProps {
  isVisible: boolean;
}

const FarmingControls: React.FC<FarmingControlsProps> = ({ isVisible }) => {
  const { character, crops, plantCrop, harvestCrop, useEnergy } = useGame();
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null);
  const [mode, setMode] = useState<'plant' | 'harvest'>('plant');
  
  if (!isVisible || character.currentLevel !== 'underground') {
    return null;
  }
  
  // Filter inventory for seed items
  const seeds = character.inventory.filter((item) => item.item.type === 'seed');
  
  // Find harvestable crops
  const harvestableCrops = crops.filter((crop) => crop.isReadyToHarvest);
  
  const handlePlant = () => {
    if (!selectedSeed) return;
    
    // Plant at a random position near the player
    const randOffset = () => Math.floor(Math.random() * 60) - 30;
    const position = {
      x: character.position.x + randOffset(),
      y: character.position.y + randOffset(),
    };
    
    plantCrop(selectedSeed, position);
  };
  
  const handleWaterCrops = () => {
    // Check if player has watering can
    const hasWateringCan = character.inventory.some(
      (item) => item.item.id === 'watering_can' && item.quantity > 0
    );
    
    if (!hasWateringCan) {
      alert('You need a watering can to water crops!');
      return;
    }
    
    // Water all crops that aren't fully grown yet
    crops.forEach((crop) => {
      if (!crop.isReadyToHarvest) {
        // In a real implementation, we would call a function to water each crop
        // For now, we'll just use energy
        useEnergy(1);
      }
    });
    
    alert('All crops have been watered!');
  };
  
  const toggleMode = () => {
    setMode(mode === 'plant' ? 'harvest' : 'plant');
  };
  
  return (
    <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-90 p-4 rounded-lg text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {mode === 'plant' ? 'Planting Mode' : 'Harvesting Mode'}
        </h3>
        <button
          onClick={toggleMode}
          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-500"
        >
          Switch to {mode === 'plant' ? 'Harvest' : 'Plant'}
        </button>
      </div>
      
      {mode === 'plant' ? (
        <>
          {seeds.length === 0 ? (
            <p className="text-gray-400 text-sm mb-3">
              You don't have any seeds. Visit the market to buy some!
            </p>
          ) : (
            <>
              <p className="text-sm mb-2">Select a seed to plant:</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {seeds.map((seedItem) => (
                  <button
                    key={seedItem.item.id}
                    onClick={() => setSelectedSeed(seedItem.item.id)}
                    className={`text-sm p-2 border rounded-md ${
                      selectedSeed === seedItem.item.id
                        ? 'bg-green-800 border-green-600'
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    {seedItem.item.name} (x{seedItem.quantity})
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handlePlant}
                  disabled={!selectedSeed || character.energy < 10}
                  className={`flex-1 py-2 rounded-md text-sm ${
                    !selectedSeed || character.energy < 10
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-green-700 hover:bg-green-600'
                  }`}
                >
                  Plant Seed (-10 Energy)
                </button>
                
                <button
                  onClick={handleWaterCrops}
                  disabled={crops.length === 0 || character.energy < 5}
                  className={`flex-1 py-2 rounded-md text-sm ${
                    crops.length === 0 || character.energy < 5
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-blue-700 hover:bg-blue-600'
                  }`}
                >
                  Water All (-5 Energy)
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {harvestableCrops.length === 0 ? (
            <p className="text-gray-400 text-sm mb-3">
              No crops are ready to harvest yet.
            </p>
          ) : (
            <>
              <p className="text-sm mb-2">
                You have {harvestableCrops.length} crops ready to harvest!
              </p>
              <button
                onClick={() => harvestableCrops.forEach((crop) => harvestCrop(crop.id))}
                disabled={character.energy < 5 * harvestableCrops.length}
                className={`w-full py-2 rounded-md text-sm ${
                  character.energy < 5 * harvestableCrops.length
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-yellow-700 hover:bg-yellow-600'
                }`}
              >
                Harvest All Crops (-{5 * harvestableCrops.length} Energy)
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FarmingControls; 