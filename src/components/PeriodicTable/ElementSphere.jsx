import { Float, Text } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const categoryColors = {
  nonmetal: "#38bdf8",
  "noble-gas": "#a78bfa",
  "alkali-metal": "#fb7185",
  "alkaline-earth": "#f59e0b",
  metalloid: "#34d399",
  halogen: "#f472b6",
  "transition-metal": "#60a5fa",
  "post-transition-metal": "#818cf8",
  lanthanide: "#f97316",
  actinide: "#ef4444",
};

export function getElementColor(category) {
  return categoryColors[category] || "#38bdf8";
}

export default function ElementSphere({
  element,
  onSelect,
  featured = false,
}) {
  const sphereRef = useRef();

  const color = getElementColor(element.category);

  useFrame((state) => {
    if (!sphereRef.current) return;

    sphereRef.current.rotation.y =
      state.clock.elapsedTime * 0.16;

    sphereRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
  });

  if (!featured) return null;

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.04}
      floatIntensity={0.18}
    >
      <group
        onClick={() => onSelect(element)}
        onPointerEnter={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          document.body.style.cursor = "default";
        }}
      >
        {/* OUTER AURA */}
        <mesh scale={1.42}>
          <sphereGeometry args={[1.8, 64, 64]} />

          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.025}
            depthWrite={false}
          />
        </mesh>

        {/* SECOND AURA */}
        <mesh scale={1.22}>
          <sphereGeometry args={[1.8, 64, 64]} />

          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.045}
            depthWrite={false}
          />
        </mesh>

        {/* MAIN SPHERE */}
        <mesh
          ref={sphereRef}
          castShadow
          receiveShadow
        >
          <sphereGeometry
            args={[1.8, 96, 96]}
          />

          <meshPhysicalMaterial
            color={color}
            metalness={0.18}
            roughness={0.14}
            clearcoat={1}
            clearcoatRoughness={0.04}
            transmission={0.04}
            thickness={0.5}
            emissive={color}
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* SOFT OUTER ENERGY SHELL */}
        <mesh scale={1.07}>
          <sphereGeometry
            args={[1.8, 64, 64]}
          />

          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.025}
            depthWrite={false}
          />
        </mesh>

        {/* ATOMIC NUMBER */}
        <Text
          position={[0, 2.25, 0]}
          fontSize={0.2}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          ATOMIC NUMBER {element.number}
        </Text>

        {/* SYMBOL */}
        <Text
          position={[0, -2.25, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {element.symbol}
        </Text>
      </group>
    </Float>
  );
}