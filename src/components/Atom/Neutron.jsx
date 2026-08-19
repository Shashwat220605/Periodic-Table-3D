import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Neutron({
  position,
  onInspect,
  index,
}) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;

    ref.current.rotation.x -= 0.002;
    ref.current.rotation.z += 0.002;

    const pulse =
      1 +
      Math.sin(
        state.clock.elapsedTime * 2.1 +
          1
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
          type: "neutron",
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
        color="#64748b"
        roughness={0.24}
        metalness={0.12}
        clearcoat={1}
        emissive="#1e293b"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}