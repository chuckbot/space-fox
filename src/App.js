import React, { Suspense, useRef } from "react";
import {
  Canvas,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import "./App.css";

extend({ OrbitControls });

const Loading = () => {
  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1, 16, 16]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        transparent
        opacity={0.6}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
};

const ArWing = () => {
  const group = useRef();
  const { nodes } = useLoader(GLTFLoader, "models/arwing.glb");

  return (
    <group ref={group}>
      <mesh visible geometry={nodes.Default.geometry}>
        <meshStandardMaterial
          attach="material"
          color="white"
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>
    </group>
  );
};

const ControlCamera = () => {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  const controls = useRef();
  useFrame((state) => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={false}
      maxAzimuthAngle={Math.PI / 4}
      maxPolarAngle={Math.PI}
      minAzimuthAngle={-Math.PI / 4}
      minPolarAngle={0}
    />
  );
};

const GROUND_HEIGHT = -50;

const Floor = () => {
  const floor = useRef();

  useFrame(() => {
    floor.current.position.z += 0.4;
  });

  return (
    <mesh
      visible
      position={[0, GROUND_HEIGHT, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      ref={floor}
    >
      <planeBufferGeometry attach="geometry" args={[5000, 5000, 12, 12]} />
      <meshStandardMaterial
        attach="material"
        color="white"
        roughness={1}
        metalness={0}
        wireframe
      />
    </mesh>
  );
};

export default function App() {
  return (
    <>
      <Canvas style={{ background: "white" }}>
        <ControlCamera />
        <directionalLight intensity={1} />
        <ambientLight intensity={0.1} />
        <Suspense fallback={<Loading />}>
          <ArWing />
        </Suspense>
        <Floor />
      </Canvas>
    </>
  );
}
