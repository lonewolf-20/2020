import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Game item types
export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'seed' | 'tool' | 'equipment' | 'resource';
  imageUrl: string;
}

// Character type
export interface Character {
  name: string;
  energy: number;
  maxEnergy: number;
  oxygen: number;
  maxOxygen: number;
  inventory: { item: Item; quantity: number }[];
  money: number;
  level: number;
  experience: number;
  position: { x: number; y: number };
  currentLevel: 'underground' | 'aboveground';
  wearingMask: boolean;
}

// Game state interface
export interface GameState {
  character: Character;
  time: {
    day: number;
    hour: number;
    minute: number;
  };
  crops: any[];
  solarPanels: any[];
  marketplaceItems: Item[];
  radiationLevel: number;
  isGamePaused: boolean;
}

// Actions interface
interface GameContextType extends GameState {
  movePlayer: (direction: 'up' | 'down' | 'left' | 'right') => void;
  changeLevel: () => void;
  toggleMask: () => void;
  buyItem: (itemId: string) => void;
  sellItem: (itemId: string) => void;
  plantCrop: (seedId: string, position: { x: number; y: number }) => void;
  harvestCrop: (cropId: string) => void;
  placeSolarPanel: (position: { x: number; y: number }) => void;
  useEnergy: (amount: number) => void;
  useOxygen: (amount: number) => void;
  gainExperience: (amount: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
}

// Initial game state
const initialGameState: GameState = {
  character: {
    name: 'Survivor',
    energy: 100,
    maxEnergy: 100,
    oxygen: 100,
    maxOxygen: 100,
    inventory: [],
    money: 500,
    level: 1,
    experience: 0,
    position: { x: 250, y: 250 },
    currentLevel: 'underground',
    wearingMask: false,
  },
  time: {
    day: 1,
    hour: 6,
    minute: 0,
  },
  crops: [],
  solarPanels: [],
  marketplaceItems: [
    {
      id: 'mask',
      name: 'Radiation Mask',
      description: 'Protects against radiation',
      price: 100,
      type: 'equipment',
      imageUrl: '/images/mask.png',
    },
    {
      id: 'oxygen_tank',
      name: 'Oxygen Tank',
      description: 'Provides oxygen for aboveground trips',
      price: 150,
      type: 'equipment',
      imageUrl: '/images/oxygen_tank.png',
    },
    {
      id: 'tomato_seed',
      name: 'Tomato Seeds',
      description: 'Plant these to grow tomatoes',
      price: 20,
      type: 'seed',
      imageUrl: '/images/tomato_seed.png',
    },
    {
      id: 'lettuce_seed',
      name: 'Lettuce Seeds',
      description: 'Plant these to grow lettuce',
      price: 15,
      type: 'seed',
      imageUrl: '/images/lettuce_seed.png',
    },
    {
      id: 'watering_can',
      name: 'Watering Can',
      description: 'Used to water your crops',
      price: 50,
      type: 'tool',
      imageUrl: '/images/watering_can.png',
    },
    {
      id: 'solar_panel',
      name: 'Solar Panel',
      description: 'Generates energy from the sun',
      price: 200,
      type: 'resource',
      imageUrl: '/images/solar_panel.png',
    },
  ],
  radiationLevel: 60,
  isGamePaused: false,
};

// Create context
export const GameContext = createContext<GameContextType>({
  ...initialGameState,
  movePlayer: () => {},
  changeLevel: () => {},
  toggleMask: () => {},
  buyItem: () => {},
  sellItem: () => {},
  plantCrop: () => {},
  harvestCrop: () => {},
  placeSolarPanel: () => {},
  useEnergy: () => {},
  useOxygen: () => {},
  gainExperience: () => {},
  pauseGame: () => {},
  resumeGame: () => {},
});

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  
  // Game loop for time progression
  useEffect(() => {
    if (gameState.isGamePaused) return;
    
    const gameLoop = setInterval(() => {
      setGameState((prevState) => {
        // Update time
        let newMinute = prevState.time.minute + 10;
        let newHour = prevState.time.hour;
        let newDay = prevState.time.day;
        
        if (newMinute >= 60) {
          newMinute = 0;
          newHour += 1;
        }
        
        if (newHour >= 24) {
          newHour = 0;
          newDay += 1;
        }
        
        // Consume oxygen if above ground
        let newOxygen = prevState.character.oxygen;
        if (prevState.character.currentLevel === 'aboveground') {
          const oxygenReduction = prevState.character.wearingMask ? 1 : 5;
          newOxygen = Math.max(0, prevState.character.oxygen - oxygenReduction);
        }
        
        // Regenerate energy if not fully depleted and underground
        let newEnergy = prevState.character.energy;
        if (prevState.character.currentLevel === 'underground' && prevState.time.hour >= 22 || prevState.time.hour <= 6) {
          newEnergy = Math.min(prevState.character.maxEnergy, prevState.character.energy + 5);
        }
        
        return {
          ...prevState,
          time: {
            day: newDay,
            hour: newHour,
            minute: newMinute,
          },
          character: {
            ...prevState.character,
            energy: newEnergy,
            oxygen: newOxygen,
          },
        };
      });
    }, 1000); // Update every second in real time
    
    return () => clearInterval(gameLoop);
  }, [gameState.isGamePaused]);
  
  // Game actions
  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    setGameState((prevState) => {
      const { position } = prevState.character;
      let newX = position.x;
      let newY = position.y;
      const moveAmount = 10;
      
      switch (direction) {
        case 'up':
          newY = Math.max(0, position.y - moveAmount);
          break;
        case 'down':
          newY = Math.min(500, position.y + moveAmount);
          break;
        case 'left':
          newX = Math.max(0, position.x - moveAmount);
          break;
        case 'right':
          newX = Math.min(800, position.x + moveAmount);
          break;
      }
      
      // Check if player has energy to move
      if (prevState.character.energy <= 0) {
        return prevState;
      }
      
      return {
        ...prevState,
        character: {
          ...prevState.character,
          position: { x: newX, y: newY },
          energy: prevState.character.energy - 1,
        },
      };
    });
  };
  
  const changeLevel = () => {
    setGameState((prevState) => {
      // Can't go above ground without oxygen
      if (
        prevState.character.currentLevel === 'underground' && 
        prevState.character.oxygen <= 0
      ) {
        return prevState;
      }
      
      return {
        ...prevState,
        character: {
          ...prevState.character,
          currentLevel: prevState.character.currentLevel === 'underground' 
            ? 'aboveground' 
            : 'underground',
          energy: prevState.character.energy - 10, // Changing levels costs energy
        },
      };
    });
  };
  
  const toggleMask = () => {
    setGameState((prevState) => {
      // Check if player has a mask in inventory
      const hasMask = prevState.character.inventory.some(
        (item) => item.item.id === 'mask' && item.quantity > 0
      );
      
      if (!hasMask && !prevState.character.wearingMask) {
        return prevState;
      }
      
      return {
        ...prevState,
        character: {
          ...prevState.character,
          wearingMask: !prevState.character.wearingMask,
        },
      };
    });
  };
  
  const buyItem = (itemId: string) => {
    setGameState((prevState) => {
      const item = prevState.marketplaceItems.find((i) => i.id === itemId);
      if (!item || prevState.character.money < item.price) {
        return prevState;
      }
      
      const existingItemIndex = prevState.character.inventory.findIndex(
        (i) => i.item.id === itemId
      );
      
      let updatedInventory = [...prevState.character.inventory];
      
      if (existingItemIndex !== -1) {
        // Item exists in inventory, increment quantity
        updatedInventory[existingItemIndex] = {
          ...updatedInventory[existingItemIndex],
          quantity: updatedInventory[existingItemIndex].quantity + 1,
        };
      } else {
        // Add new item to inventory
        updatedInventory.push({
          item,
          quantity: 1,
        });
      }
      
      return {
        ...prevState,
        character: {
          ...prevState.character,
          money: prevState.character.money - item.price,
          inventory: updatedInventory,
        },
      };
    });
  };
  
  const sellItem = (itemId: string) => {
    setGameState((prevState) => {
      const inventoryItemIndex = prevState.character.inventory.findIndex(
        (i) => i.item.id === itemId
      );
      
      if (inventoryItemIndex === -1 || prevState.character.inventory[inventoryItemIndex].quantity <= 0) {
        return prevState;
      }
      
      const item = prevState.character.inventory[inventoryItemIndex].item;
      const sellPrice = Math.floor(item.price * 0.7); // Sell for 70% of buy price
      
      let updatedInventory = [...prevState.character.inventory];
      
      if (updatedInventory[inventoryItemIndex].quantity > 1) {
        // Decrement quantity
        updatedInventory[inventoryItemIndex] = {
          ...updatedInventory[inventoryItemIndex],
          quantity: updatedInventory[inventoryItemIndex].quantity - 1,
        };
      } else {
        // Remove item from inventory
        updatedInventory = updatedInventory.filter((_, index) => index !== inventoryItemIndex);
      }
      
      return {
        ...prevState,
        character: {
          ...prevState.character,
          money: prevState.character.money + sellPrice,
          inventory: updatedInventory,
        },
      };
    });
  };
  
  const plantCrop = (seedId: string, position: { x: number; y: number }) => {
    setGameState((prevState) => {
      const seedInventoryIndex = prevState.character.inventory.findIndex(
        (i) => i.item.id === seedId && i.item.type === 'seed'
      );
      
      if (
        seedInventoryIndex === -1 || 
        prevState.character.inventory[seedInventoryIndex].quantity <= 0 ||
        prevState.character.energy < 10
      ) {
        return prevState;
      }
      
      // Check if position overlaps with existing crops
      const cropExists = prevState.crops.some(
        (crop) => 
          Math.abs(crop.position.x - position.x) < 20 && 
          Math.abs(crop.position.y - position.y) < 20
      );
      
      if (cropExists) {
        return prevState;
      }
      
      const seedItem = prevState.character.inventory[seedInventoryIndex].item;
      const cropType = seedItem.id.split('_')[0]; // Extract crop type from seed id
      
      let updatedInventory = [...prevState.character.inventory];
      
      if (updatedInventory[seedInventoryIndex].quantity > 1) {
        updatedInventory[seedInventoryIndex] = {
          ...updatedInventory[seedInventoryIndex],
          quantity: updatedInventory[seedInventoryIndex].quantity - 1,
        };
      } else {
        updatedInventory = updatedInventory.filter((_, index) => index !== seedInventoryIndex);
      }
      
      const newCrop = {
        id: `crop_${Date.now()}`,
        type: cropType,
        position,
        plantedDay: prevState.time.day,
        plantedHour: prevState.time.hour,
        growth: 0,
        waterLevel: 50,
        isReadyToHarvest: false,
      };
      
      return {
        ...prevState,
        crops: [...prevState.crops, newCrop],
        character: {
          ...prevState.character,
          inventory: updatedInventory,
          energy: prevState.character.energy - 10,
        },
      };
    });
  };
  
  const harvestCrop = (cropId: string) => {
    setGameState((prevState) => {
      const cropIndex = prevState.crops.findIndex((c) => c.id === cropId);
      
      if (
        cropIndex === -1 || 
        !prevState.crops[cropIndex].isReadyToHarvest ||
        prevState.character.energy < 5
      ) {
        return prevState;
      }
      
      const crop = prevState.crops[cropIndex];
      const harvestedItem = {
        id: `${crop.type}`,
        name: `${crop.type.charAt(0).toUpperCase() + crop.type.slice(1)}`,
        description: `A freshly harvested ${crop.type}`,
        price: 40, // Harvested crops are valuable
        type: 'resource' as const,
        imageUrl: `/images/${crop.type}.png`,
      };
      
      // Add harvested item to inventory
      const existingItemIndex = prevState.character.inventory.findIndex(
        (i) => i.item.id === harvestedItem.id
      );
      
      let updatedInventory = [...prevState.character.inventory];
      
      if (existingItemIndex !== -1) {
        updatedInventory[existingItemIndex] = {
          ...updatedInventory[existingItemIndex],
          quantity: updatedInventory[existingItemIndex].quantity + 1,
        };
      } else {
        updatedInventory.push({
          item: harvestedItem,
          quantity: 1,
        });
      }
      
      // Remove harvested crop
      const updatedCrops = prevState.crops.filter((_, index) => index !== cropIndex);
      
      return {
        ...prevState,
        crops: updatedCrops,
        character: {
          ...prevState.character,
          inventory: updatedInventory,
          energy: prevState.character.energy - 5,
          experience: prevState.character.experience + 10,
        },
      };
    });
  };
  
  const placeSolarPanel = (position: { x: number; y: number }) => {
    setGameState((prevState) => {
      // Check if player is above ground
      if (prevState.character.currentLevel !== 'aboveground') {
        return prevState;
      }
      
      const solarPanelInventoryIndex = prevState.character.inventory.findIndex(
        (i) => i.item.id === 'solar_panel'
      );
      
      if (
        solarPanelInventoryIndex === -1 || 
        prevState.character.inventory[solarPanelInventoryIndex].quantity <= 0 ||
        prevState.character.energy < 20
      ) {
        return prevState;
      }
      
      // Check if position overlaps with existing solar panels
      const solarPanelExists = prevState.solarPanels.some(
        (panel) => 
          Math.abs(panel.position.x - position.x) < 30 && 
          Math.abs(panel.position.y - position.y) < 30
      );
      
      if (solarPanelExists) {
        return prevState;
      }
      
      let updatedInventory = [...prevState.character.inventory];
      
      if (updatedInventory[solarPanelInventoryIndex].quantity > 1) {
        updatedInventory[solarPanelInventoryIndex] = {
          ...updatedInventory[solarPanelInventoryIndex],
          quantity: updatedInventory[solarPanelInventoryIndex].quantity - 1,
        };
      } else {
        updatedInventory = updatedInventory.filter((_, index) => index !== solarPanelInventoryIndex);
      }
      
      const newSolarPanel = {
        id: `solar_panel_${Date.now()}`,
        position,
        efficiency: 100,
        energyProduced: 0,
      };
      
      return {
        ...prevState,
        solarPanels: [...prevState.solarPanels, newSolarPanel],
        character: {
          ...prevState.character,
          inventory: updatedInventory,
          energy: prevState.character.energy - 20,
          experience: prevState.character.experience + 15,
        },
      };
    });
  };
  
  const useEnergy = (amount: number) => {
    setGameState((prevState) => ({
      ...prevState,
      character: {
        ...prevState.character,
        energy: Math.max(0, prevState.character.energy - amount),
      },
    }));
  };
  
  const useOxygen = (amount: number) => {
    setGameState((prevState) => ({
      ...prevState,
      character: {
        ...prevState.character,
        oxygen: Math.max(0, prevState.character.oxygen - amount),
      },
    }));
  };
  
  const gainExperience = (amount: number) => {
    setGameState((prevState) => {
      const newExperience = prevState.character.experience + amount;
      const experienceThreshold = prevState.character.level * 100;
      
      // Level up if enough experience
      if (newExperience >= experienceThreshold) {
        return {
          ...prevState,
          character: {
            ...prevState.character,
            level: prevState.character.level + 1,
            experience: newExperience - experienceThreshold,
            maxEnergy: prevState.character.maxEnergy + 10,
            maxOxygen: prevState.character.maxOxygen + 10,
            energy: prevState.character.maxEnergy + 10, // Refill energy on level up
            oxygen: prevState.character.maxOxygen + 10, // Refill oxygen on level up
          },
        };
      }
      
      return {
        ...prevState,
        character: {
          ...prevState.character,
          experience: newExperience,
        },
      };
    });
  };
  
  const pauseGame = () => {
    setGameState((prevState) => ({
      ...prevState,
      isGamePaused: true,
    }));
  };
  
  const resumeGame = () => {
    setGameState((prevState) => ({
      ...prevState,
      isGamePaused: false,
    }));
  };
  
  return (
    <GameContext.Provider
      value={{
        ...gameState,
        movePlayer,
        changeLevel,
        toggleMask,
        buyItem,
        sellItem,
        plantCrop,
        harvestCrop,
        placeSolarPanel,
        useEnergy,
        useOxygen,
        gainExperience,
        pauseGame,
        resumeGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for using the game context
export const useGame = () => useContext(GameContext); 