import React, { useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
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

// Keyboard control setup for WASD movement
function usePlayerControls() {
  const keys = useRef({});

  useEffect(() => {
    const handleKeyDown = (event) => (keys.current[event.key] = true);
    const handleKeyUp = (event) => (keys.current[event.key] = false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}

// Player movement component
function PlayerMovement() {
  const { camera } = useThree();
  const keys = usePlayerControls();

  useFrame(() => {
    const speed = 0.1;
    if (keys.current['w']) camera.position.z -= speed;
    if (keys.current['s']) camera.position.z += speed;
    if (keys.current['a']) camera.position.x -= speed;
    if (keys.current['d']) camera.position.x += speed;
  });

  return null;
}

// Function to simulate a torch with light
function TorchLight() {
  return (
    <>
      {/* Torch block */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* Light coming from the torch */}
      <pointLight position={[0, 1.5, 0]} intensity={1.5} distance={5} decay={2} color="orange" />
    </>
  );
}

function App() {
  return (
    <Canvas style={{ background: 'white' }}>
      <ambientLight intensity={0.1} />
      <directionalLight intensity={0.2} position={[10, 10, 5]} />

      <MinecraftRoom />
      <TorchLight />

      <PlayerMovement />
      <PointerLockControls /> {/* Locks cursor and enables free movement */}
    </Canvas>
  );
}

export default App;
