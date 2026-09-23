"use client";
import { ContactShadows, Float, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { Group } from "three";
function Building() {
  const building = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!building.current) return;
    building.current.rotation.y += delta * 0.06;
    building.current.rotation.x +=
      (state.pointer.y * 0.035 - building.current.rotation.x) * 0.04;
  });
  return (
    <group ref={building} rotation={[0.03, -0.5, 0]}>
      <RoundedBox args={[2.25, 3.6, 1.42]} radius={0.12} smoothness={4}>
        <meshStandardMaterial color="#e7d3b5" roughness={0.72} />
      </RoundedBox>
      {Array.from({ length: 7 }).map((_, floor) => (
        <group key={floor} position={[0, 1.42 - floor * 0.46, 0.73]}>
          {[-0.7, -0.23, 0.23, 0.7].map((x, index) => (
            <mesh key={x} position={[x, 0, 0]}>
              <boxGeometry args={[0.28, 0.23, 0.035]} />
              <meshStandardMaterial
                color={index % 2 ? "#d77a4e" : "#244f42"}
                roughness={0.38}
              />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[-1.17, -1.34, 0.1]}>
        <boxGeometry args={[0.12, 0.72, 1.1]} />
        <meshStandardMaterial color="#d77a4e" />
      </mesh>
      <mesh position={[0, -1.84, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.7, 2.1, 0.1, 48]} />
        <meshStandardMaterial color="#285246" roughness={0.8} />
      </mesh>
    </group>
  );
}
export default function BuildingScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      aria-label="Mô hình 3D ABC Apartment"
      camera={{ position: [0, 0.1, 6.7], fov: 34 }}
      dpr={[1, 1.35]}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[4, 5, 5]} intensity={3.2} color="#fff2db" />
      <pointLight position={[-4, 0, 3]} intensity={2.8} color="#90c8ae" />
      <Float
        speed={reduced ? 0 : 1.15}
        floatIntensity={0.28}
        rotationIntensity={0.06}
      >
        <Building />
      </Float>
      <ContactShadows
        position={[0, -1.9, 0]}
        opacity={0.22}
        scale={7}
        blur={2.6}
        far={4}
      />
    </Canvas>
  );
}
