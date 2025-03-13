import React, { useState } from 'react';
import { useGame, Item } from '@/lib/contexts/GameContext';

interface GameInterfaceProps {
  onStartGame: () => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({ onStartGame }) => {
  const {
    character,
    time,
    marketplaceItems,
    changeLevel,
    toggleMask,
    buyItem,
    sellItem,
    pauseGame,
    resumeGame,
    isGamePaused,
  } = useGame();
  
  const [showInventory, setShowInventory] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'inventory' | 'market' | 'stats'>('inventory');
  
  // Calculate if player is near marketplace (for interaction)
  const isNearMarketplace = character.currentLevel === 'aboveground' && 
    Math.abs(character.position.x - 700) < 50 && Math.abs(character.position.y - 100) < 50;
  
  // Calculate if player is near elevator (for level change)
  const isNearElevator = Math.abs(character.position.x - 400) < 50 && Math.abs(character.position.y - 250) < 50;
  
  const toggleInventory = () => {
    setShowInventory(!showInventory);
    if (!showInventory) {
      setShowMarketplace(false);
      setSelectedTab('inventory');
      pauseGame();
    } else {
      resumeGame();
    }
  };
  
  const toggleMarketplace = () => {
    if (!isNearMarketplace) return;
    
    setShowMarketplace(!showMarketplace);
    if (!showMarketplace) {
      setShowInventory(false);
      setSelectedTab('market');
      pauseGame();
    } else {
      resumeGame();
    }
  };
  
  const handleLevelChange = () => {
    if (!isNearElevator) return;
    
    // Check if player has oxygen to go above ground
    if (character.currentLevel === 'underground' && character.oxygen <= 0) {
      alert('You need oxygen to go above ground!');
      return;
    }
    
    changeLevel();
  };
  
  const handleToggleMask = () => {
    if (character.currentLevel !== 'aboveground') {
      alert('You can only wear masks above ground!');
      return;
    }
    
    toggleMask();
  };
  
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-center">
      {/* Game controls */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={toggleInventory}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          {showInventory ? 'Close Inventory' : 'Inventory'}
        </button>
        
        {isNearMarketplace && (
          <button
            onClick={toggleMarketplace}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            {showMarketplace ? 'Close Market' : 'Shop'}
          </button>
        )}
        
        {isNearElevator && (
          <button
            onClick={handleLevelChange}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            {character.currentLevel === 'underground' ? 'Go Above Ground' : 'Go Underground'}
          </button>
        )}
        
        {character.currentLevel === 'aboveground' && (
          <button
            onClick={handleToggleMask}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            {character.wearingMask ? 'Remove Mask' : 'Wear Mask'}
          </button>
        )}
      </div>
      
      {/* Inventory and Marketplace Interface */}
      {(showInventory || showMarketplace) && (
        <div className="bg-gray-900 bg-opacity-90 text-white rounded-lg p-6 w-full max-w-3xl">
          <div className="flex border-b border-gray-700 mb-4">
            <button
              className={`px-4 py-2 ${selectedTab === 'inventory' ? 'bg-gray-700 rounded-t-md' : ''}`}
              onClick={() => setSelectedTab('inventory')}
            >
              Inventory
            </button>
            {isNearMarketplace && (
              <button
                className={`px-4 py-2 ${selectedTab === 'market' ? 'bg-gray-700 rounded-t-md' : ''}`}
                onClick={() => setSelectedTab('market')}
              >
                Market
              </button>
            )}
            <button
              className={`px-4 py-2 ${selectedTab === 'stats' ? 'bg-gray-700 rounded-t-md' : ''}`}
              onClick={() => setSelectedTab('stats')}
            >
              Stats
            </button>
          </div>
          
          {/* Inventory Tab */}
          {selectedTab === 'inventory' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Your Inventory</h3>
              {character.inventory.length === 0 ? (
                <p className="text-gray-400">Your inventory is empty.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {character.inventory.map((inventoryItem) => (
                    <div
                      key={inventoryItem.item.id}
                      className="border border-gray-700 rounded-md p-3 bg-gray-800"
                    >
                      <div className="w-16 h-16 mx-auto mb-2 bg-gray-700 rounded-md flex items-center justify-center text-4xl">
                        {inventoryItem.item.id.includes('seed') ? '🌱' : 
                          inventoryItem.item.id.includes('mask') ? '😷' : 
                          inventoryItem.item.id.includes('oxygen') ? '💨' : 
                          inventoryItem.item.id.includes('panel') ? '☀️' : 
                          inventoryItem.item.id.includes('tomato') ? '🍅' : 
                          inventoryItem.item.id.includes('lettuce') ? '🥬' : '📦'}
                      </div>
                      <h4 className="font-semibold text-center">{inventoryItem.item.name}</h4>
                      <p className="text-gray-400 text-sm text-center">{inventoryItem.item.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-yellow-400">x{inventoryItem.quantity}</span>
                        <button
                          onClick={() => sellItem(inventoryItem.item.id)}
                          className="bg-red-800 text-white px-2 py-1 rounded-md text-xs hover:bg-red-700"
                        >
                          Sell (${Math.floor(inventoryItem.item.price * 0.7)})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Market Tab */}
          {selectedTab === 'market' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Market</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {marketplaceItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-700 rounded-md p-3 bg-gray-800"
                  >
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-700 rounded-md flex items-center justify-center text-4xl">
                      {item.id.includes('seed') ? '🌱' : 
                        item.id.includes('mask') ? '😷' : 
                        item.id.includes('oxygen') ? '💨' : 
                        item.id.includes('panel') ? '☀️' : 
                        item.id.includes('watering') ? '💧' : '📦'}
                    </div>
                    <h4 className="font-semibold text-center">{item.name}</h4>
                    <p className="text-gray-400 text-sm text-center">{item.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-yellow-400">${item.price}</span>
                      <button
                        onClick={() => buyItem(item.id)}
                        disabled={character.money < item.price}
                        className={`${
                          character.money < item.price ? 'bg-gray-600' : 'bg-green-800 hover:bg-green-700'
                        } text-white px-2 py-1 rounded-md text-xs`}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <p className="text-yellow-400 font-bold">Your Money: ${character.money}</p>
              </div>
            </div>
          )}
          
          {/* Stats Tab */}
          {selectedTab === 'stats' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Character Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-700 rounded-md p-3 bg-gray-800">
                  <h4 className="font-semibold">Basic Info</h4>
                  <ul className="mt-2 space-y-1">
                    <li>Name: {character.name}</li>
                    <li>Level: {character.level}</li>
                    <li>XP: {character.experience}/{character.level * 100}</li>
                    <li>Money: ${character.money}</li>
                  </ul>
                </div>
                
                <div className="border border-gray-700 rounded-md p-3 bg-gray-800">
                  <h4 className="font-semibold">Resources</h4>
                  <ul className="mt-2 space-y-1">
                    <li>Energy: {Math.floor(character.energy)}/{character.maxEnergy}</li>
                    <li>Oxygen: {Math.floor(character.oxygen)}/{character.maxOxygen}</li>
                    <li>Current Location: {character.currentLevel === 'underground' ? 'Underground' : 'Aboveground'}</li>
                    <li>Wearing Mask: {character.wearingMask ? 'Yes' : 'No'}</li>
                  </ul>
                </div>
                
                <div className="border border-gray-700 rounded-md p-3 bg-gray-800 col-span-2">
                  <h4 className="font-semibold">Game Info</h4>
                  <ul className="mt-2 space-y-1">
                    <li>Day: {time.day}</li>
                    <li>Time: {time.hour.toString().padStart(2, '0')}:{time.minute.toString().padStart(2, '0')}</li>
                    <li>Crops Planted: {character.currentLevel === 'underground' ? 'X' : 'N/A'}</li>
                    <li>Solar Panels: {character.currentLevel === 'aboveground' ? 'X' : 'N/A'}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameInterface; 