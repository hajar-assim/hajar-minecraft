import React, { useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls, useTexture } from '@react-three/drei';
import './App.css';
import * as THREE from 'three';

function Crosshair() {
  return <div className="crosshair">+</div>;
}

function MinecraftRoom() {
  const woodTexture = useTexture('/textures/minecraft_wood.png');
  const blocks = [];
  const size = 10;

  for (let x = -size / 2; x < size / 2; x++) {
    for (let z = -size / 2; z < size / 2; z++) {
      blocks.push(
        <mesh key={`floor_${x},${z}`} position={[x, 0.5, z]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial map={woodTexture} />
        </mesh>
      );
      blocks.push(
        <mesh key={`ceiling_${x},${z}`} position={[x, size + 0.5, z]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial map={woodTexture} />
        </mesh>
      );
    }
  }

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

function PlayerMovement() {
  const { camera } = useThree();
  const keys = usePlayerControls();

  useFrame(() => {
    const speed = 0.1;
    
    // get the camera's current rotation
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    
    // create a forward vector based on the camera's rotation
    camera.getWorldDirection(forward);
    forward.y = 0; 
    forward.normalize(); 

    // create a right vector by rotating the forward vector
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    // movement controls
    if (keys.current['w']) camera.position.add(forward.clone().multiplyScalar(speed)); // Move forward
    if (keys.current['s']) camera.position.add(forward.clone().multiplyScalar(-speed)); // Move backward
    if (keys.current['a']) camera.position.add(right.clone().multiplyScalar(-speed)); // Strafe left
    if (keys.current['d']) camera.position.add(right.clone().multiplyScalar(speed)); // Strafe right

    // upward and downward movement
    if (keys.current[' ']) camera.position.y += speed; // spacebar
    if (keys.current['Shift']) camera.position.y -= speed;
  });

  return null;
}

function TorchLight() {
  return (
    <>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <pointLight position={[0, 1.5, 0]} intensity={1.5} distance={5} decay={2} color="orange" />
    </>
  );
}

function App() {
  return (
    <>
      <Canvas style={{ background: 'white' }}>
        <ambientLight intensity={0.1} />
        <directionalLight intensity={0.2} position={[10, 10, 5]} />
        <MinecraftRoom />
        <TorchLight />
        <PlayerMovement />
        <PointerLockControls />
      </Canvas>
      <Crosshair />
    </>
  );
}

export default App;
