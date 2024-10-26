import React, { useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
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

// Function to simulate a torch with light
function TorchLight() {
  const torchLightRef = useRef();

  return (
    <>
      {/* Torch block */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* Light coming from the torch */}
      <pointLight
        ref={torchLightRef}
        position={[0, 1.5, 0]}
        intensity={1.5}
        distance={5}
        decay={2}
        color="orange"
      />
    </>
  );
}

// Custom controls component with camera restrictions
function RestrictedControls() {
  const controlsRef = useRef();
  const { camera } = useThree();

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false} // Disable zooming
      minPolarAngle={Math.PI / 3} // Limit vertical rotation
      maxPolarAngle={2 * Math.PI / 3}
      maxAzimuthAngle={Math.PI / 4} // Limit horizontal rotation
      minAzimuthAngle={-Math.PI / 4}
      target={[0, 2, 0]} // Camera focus target inside the box
      camera={camera}
    />
  );
}

function App() {
  return (
    <Canvas style={{ background: 'white' }}>
      {/* Reduced ambient and directional lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight intensity={0.2} position={[10, 10, 5]} />

      <MinecraftRoom />
      <TorchLight /> {/* Add torch light in the center */}
      <RestrictedControls /> {/* Restricted controls to trap the user inside */}
    </Canvas>
  );
}

export default App;
