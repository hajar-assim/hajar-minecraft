import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import './App.css';

// Function to add Minecraft-style floor
function MinecraftFloor() {
  const woodTexture = useTexture('/textures/minecraft_wood.png'); // Ensure the path is correct

  const blocks = [];
  const size = 10; // Define the size of the grid

  for (let x = -size / 2; x < size / 2; x++) {
    for (let z = -size / 2; z < size / 2; z++) {
      blocks.push(
        <mesh key={`${x},${z}`} position={[x, 0.5, z]}> {/* Centering the blocks on the Y-axis */}
          <boxGeometry args={[1, 1, 1]} /> {/* Create a 1x1x1 cube */}
          <meshStandardMaterial map={woodTexture} />
        </mesh>
      );
    }
  }

  return <>{blocks}</>;
}

function App() {
  return (
    <Canvas style={{ background: 'white' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <MinecraftFloor />
      <OrbitControls /> {/* Add this line to enable navigation */}
    </Canvas>
  );
}

export default App;
