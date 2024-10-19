import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import './App.css';

// Function to generate the floor, ceiling, and walls made of Minecraft-style cubes
function MinecraftRoom() {
  const woodTexture = useTexture('/textures/minecraft_wood.png');

  const blocks = [];
  const size = 10; // room size

  // Floor
  for (let x = -size / 2; x < size / 2; x++) {
    for (let z = -size / 2; z < size / 2; z++) {
      blocks.push(
        <mesh key={`floor_${x},${z}`} position={[x, 0.5, z]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial map={woodTexture} />
        </mesh>
      );
    }
  }

  // Ceiling
  for (let x = -size / 2; x < size / 2; x++) {
    for (let z = -size / 2; z < size / 2; z++) {
      blocks.push(
        <mesh key={`ceiling_${x},${z}`} position={[x, size + 0.5, z]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial map={woodTexture} />
        </mesh>
      );
    }
  }

  // Walls (positive and negative Z direction)
  for (let x = -size / 2; x < size / 2; x++) {
    for (let y = 0.5; y < size; y++) {
      blocks.push(
        <mesh key={`wall_posZ_${x},${y}`} position={[x, y, size / 2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial map={woodTexture} />
        </mesh>
      );
      blocks.push(
        <mesh key={`wall_negZ_${x},${y}`} position={[x, y, -size / 2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial map={woodTexture} />
        </mesh>
      );
    }
  }

  // Walls (positive and negative X direction)
  for (let z = -size / 2; z < size / 2; z++) {
    for (let y = 0.5; y < size; y++) {
      blocks.push(
        <mesh key={`wall_posX_${z},${y}`} position={[size / 2, y, z]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial map={woodTexture} />
        </mesh>
      );
      blocks.push(
        <mesh key={`wall_negX_${z},${y}`} position={[-size / 2, y, z]}>
          <boxGeometry args={[1, 1, 1]} />
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
      <MinecraftRoom />
      <OrbitControls />
    </Canvas>
  );
}

export default App;
