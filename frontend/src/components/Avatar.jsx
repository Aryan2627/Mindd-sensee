import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model({ speaking }) {
  const { scene } = useGLTF(
    "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
  );

  return (
    <primitive
      object={scene}
      scale={2}
      position={[0, -1.5, 0]}
      rotation={[0, speaking ? 0.2 : 0, 0]}
    />
  );
}

export default function Avatar({ speaking }) {
  return (
    <div className="w-48 h-48">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} />
        <Model speaking={speaking} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}