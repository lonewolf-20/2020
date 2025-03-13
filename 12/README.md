# Wasteland Gardens

A post-apocalyptic farming simulation game inspired by Stardew Valley, where players must balance underground hydroponic farming with above-ground solar panel management to survive in a world devastated by nuclear war.

## Game Concept

In Wasteland Gardens, you play as a survivor in a post-nuclear holocaust world. Your community lives underground in bunkers, using hydroponic farming to grow food. To power your community, you must venture to the dangerous surface to build and maintain solar panels.

The game features:

- **Two-level Gameplay**: Switch between underground (farming) and above ground (solar power) levels
- **Resource Management**: Balance energy, oxygen, and supplies
- **Farming Mechanics**: Plant, water, and harvest crops in your underground hydroponic farm
- **Solar Panel System**: Build and maintain solar panels on the radiation-filled surface
- **Marketplace**: Buy seeds, equipment, and essential supplies like oxygen tanks and radiation masks
- **Progression System**: Earn experience, level up, and improve your character's abilities

## Game Mechanics

### Underground Level

- **Hydroponic Farming**: Plant various crops that grow over time
- **Energy Management**: Actions consume energy, which regenerates while sleeping
- **Crop Selling**: Harvest crops and sell them at the marketplace for profit

### Above Ground Level

- **Radiation Danger**: The surface is filled with radiation that depletes health if not wearing a mask
- **Oxygen System**: Limited oxygen supply that decreases while above ground
- **Solar Panel Placement**: Build and maintain solar panels to generate energy for the underground
- **Resource Collection**: Gather rare resources that can only be found on the surface

### Marketplace

- Buy and sell items
- Purchase equipment upgrades
- Restock on essential supplies like seeds, oxygen tanks, and masks

## Controls

- **WASD/Arrow Keys**: Move character
- **F Key**: Toggle farming controls
- **S Key**: Toggle solar panel controls
- **ESC**: Pause/resume game

## Technical Implementation

This game is built using:

- **Next.js**: For the web application framework
- **React**: For the component-based UI
- **Canvas API**: For rendering the game graphics
- **TypeScript**: For type-safe code
- **TailwindCSS**: For styling

## Game Architecture

- **GameContext**: Manages the game state and provides actions for interacting with the game
- **GameEngine**: Handles rendering, input, and game loop
- **GameInterface**: Provides UI elements for player interaction
- **FarmingControls**: Handles planting, watering, and harvesting crops
- **SolarControls**: Manages solar panel placement and maintenance

## Future Enhancements

- Weather system that affects both farming and solar efficiency
- Community management system where you need to provide for other survivors
- Exploration mechanics to discover new areas and resources
- Crafting system for creating advanced tools and equipment
- Storyline missions that reveal more about the post-apocalyptic world

---

## Development

### Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Project Structure

- `/src/components`: React components for the game
- `/src/lib/contexts`: Context providers for game state
- `/src/app`: Next.js App Router structure
- `/public/images`: Game assets and images

## Credits

This game is built as a demonstration project for educational purposes.
Inspired by games like Stardew Valley, Fallout Shelter, and Oxygen Not Included.