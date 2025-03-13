import React, { useState } from 'react';
import { useGame } from '@/lib/contexts/GameContext';

interface SolarControlsProps {
  isVisible: boolean;
}

const SolarControls: React.FC<SolarControlsProps> = ({ isVisible }) => {
  const { character, solarPanels, placeSolarPanel, useEnergy, radiationLevel } = useGame();
  
  if (!isVisible || character.currentLevel !== 'aboveground') {
    return null;
  }
  
  // Filter inventory for solar panels
  const solarPanelItems = character.inventory.filter((item) => item.item.id === 'solar_panel');
  const solarPanelCount = solarPanelItems.length > 0 ? solarPanelItems[0].quantity : 0;
  
  // Calculate energy production based on solar panels and radiation level
  const calculateEnergyProduction = () => {
    const baseProduction = solarPanels.length * 10;
    const efficiencyFactor = (100 - radiationLevel) / 100;
    return Math.floor(baseProduction * efficiencyFactor);
  };
  
  const handlePlaceSolarPanel = () => {
    if (solarPanelCount === 0) {
      alert('You need solar panels to place them! Visit the market to buy some.');
      return;
    }
    
    if (character.energy < 20) {
      alert('Not enough energy to place a solar panel!');
      return;
    }
    
    // Place solar panel near the player
    const randOffset = () => Math.floor(Math.random() * 80) - 40;
    const position = {
      x: character.position.x + randOffset(),
      y: character.position.y + randOffset(),
    };
    
    placeSolarPanel(position);
  };
  
  const handleCleanSolarPanels = () => {
    if (solarPanels.length === 0) {
      alert('You have no solar panels to clean!');
      return;
    }
    
    if (character.energy < solarPanels.length * 2) {
      alert('Not enough energy to clean all solar panels!');
      return;
    }
    
    // Clean all solar panels (in a real implementation, we would update efficiency)
    useEnergy(solarPanels.length * 2);
    alert('All solar panels have been cleaned!');
  };
  
  return (
    <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 p-4 rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-3">Solar Power Management</h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm">Current Production:</span>
          <span className="text-yellow-400 font-semibold">{calculateEnergyProduction()} Energy/day</span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm">Solar Panels Placed:</span>
          <span className="text-green-400">{solarPanels.length}</span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm">Radiation Level:</span>
          <span className={`${radiationLevel > 70 ? 'text-red-400' : 'text-orange-400'}`}>
            {radiationLevel}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Solar Panels In Inventory:</span>
          <span className="text-blue-400">{solarPanelCount}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handlePlaceSolarPanel}
          disabled={solarPanelCount === 0 || character.energy < 20}
          className={`py-2 px-1 rounded-md text-sm ${
            solarPanelCount === 0 || character.energy < 20
              ? 'bg-gray-700 text-gray-400'
              : 'bg-blue-700 hover:bg-blue-600'
          }`}
        >
          Place Panel (-20 Energy)
        </button>
        
        <button
          onClick={handleCleanSolarPanels}
          disabled={solarPanels.length === 0 || character.energy < solarPanels.length * 2}
          className={`py-2 px-1 rounded-md text-sm ${
            solarPanels.length === 0 || character.energy < solarPanels.length * 2
              ? 'bg-gray-700 text-gray-400'
              : 'bg-green-700 hover:bg-green-600'
          }`}
        >
          Clean Panels (-{solarPanels.length * 2} Energy)
        </button>
      </div>
      
      {!character.wearingMask && (
        <div className="mt-4 p-2 bg-red-900 rounded-md text-sm">
          <span className="text-red-300 font-bold">⚠️ Warning:</span> You are not wearing a radiation mask!
          Your health is decreasing rapidly.
        </div>
      )}
    </div>
  );
};

export default SolarControls; 