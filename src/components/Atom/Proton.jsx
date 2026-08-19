import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Proton({
  position,
  onInspect,
  index,
}) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;

    ref.current.rotation.x += 0.002;
    ref.current.rotation.y += 0.003;

    const pulse =
      1 +
      Math.sin(
        state.clock.elapsedTime * 2.5
      ) *
        0.025;

    ref.current.scale.setScalar(
      pulse
    );
  });

  return (
    <mesh
      ref={ref}
      position={position}
      castShadow
      onClick={(event) => {
        event.stopPropagation();

        onInspect?.({
          type: "proton",
          index,
        });
      }}
      onPointerEnter={() => {
        document.body.style.cursor =
          "pointer";
      }}
      onPointerLeave={() => {
        document.body.style.cursor =
          "default";
      }}
    >
      <sphereGeometry
        args={[0.18, 32, 32]}
      />

      <meshPhysicalMaterial
        color="#ef4444"
        roughness={0.2}
        metalness={0.15}
        clearcoat={1}
        emissive="#7f1d1d"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}