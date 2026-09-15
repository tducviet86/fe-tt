"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  RoundedBox,
  Sparkles,
} from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { Group } from "three";

function RoomSculpture() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.08;
    group.current.rotation.x = state.pointer.y * 0.08;
    group.current.position.x = state.pointer.x * 0.18;
  });

  return (
    <group ref={group} rotation={[0.18, -0.5, -0.08]}>
      <Float speed={1.6} rotationIntensity={0.12} floatIntensity={0.35}>
        <RoundedBox args={[2.9, 1.65, 0.22]} radius={0.18} smoothness={5}>
          <MeshDistortMaterial
            color="#d8794b"
            roughness={0.35}
            metalness={0.08}
            distort={0.12}
            speed={1.4}
          />
        </RoundedBox>
        <RoundedBox
          args={[1.75, 1.08, 0.3]}
          radius={0.14}
          smoothness={5}
          position={[-0.1, 0.02, 0.22]}
        >
          <meshStandardMaterial color="#f3c999" roughness={0.5} />
        </RoundedBox>
        <mesh position={[-0.6, -0.08, 0.4]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#163f35" roughness={0.3} />
        </mesh>
        <mesh position={[0.2, -0.08, 0.4]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#163f35" roughness={0.3} />
        </mesh>
      </Float>
      <Sparkles
        count={18}
        scale={[4, 2.6, 2]}
        size={2.2}
        speed={0.25}
        color="#f7dec0"
      />
    </group>
  );
}

export function SearchAtmosphere() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 38 }}
        dpr={[1, 1.5]}
        frameloop={reduceMotion ? "demand" : "always"}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.8} />
        <directionalLight
          position={[3, 4, 5]}
          intensity={3.5}
          color="#fff1dd"
        />
        <pointLight position={[-3, -1, 3]} intensity={2.5} color="#75c3a5" />
        <RoomSculpture />
      </Canvas>
    </div>
  );
}
