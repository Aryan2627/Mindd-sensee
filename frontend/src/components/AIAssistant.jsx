import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { useRef } from "react";

function AnimatedOrb({ isSpeaking, emotion }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Base breathing animation
    let scale = 1 + Math.sin(t * 2) * 0.05;

    // Speaking pulse
    if (isSpeaking) {
      scale = 1 + Math.sin(t * 8) * 0.2;
    }

    meshRef.current.scale.set(scale, scale, scale);

    // Rotation
    meshRef.current.rotation.y += 0.01;
  });

  const getColor = () => {
    switch (emotion) {
      case "happy":
        return "#00ff88";
      case "sad":
        return "#3399ff";
      case "angry":
        return "#ff3333";
      case "calm":
        return "#ccccff";
      default:
        return "#ffffff";
    }
  };

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={getColor()}
        emissive={getColor()}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

export default function AIAssistant({ isSpeaking, emotion }) {
  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />

        <AnimatedOrb isSpeaking={isSpeaking} emotion={emotion} />
      </Canvas>
    </div>
  );
}