import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Electron({
  radius,
  speed,
  offset = 0,
  inclination = 0,
  shell,
  orbital,
  onInspect,
}) {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const time =
      clock.elapsedTime * speed + offset;

    ref.current.position.x =
      Math.cos(time) * radius;

    ref.current.position.z =
      Math.sin(time) * radius;
  });

  return (
    <group rotation={[inclination, 0, 0]}>
      <mesh
        ref={ref}
        onClick={(event) => {
          event.stopPropagation();

          onInspect?.({
            type: "electron",
            shell,
            orbital,
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
          args={[0.09, 32, 32]}
        />

        <meshPhysicalMaterial
          color="#7dd3fc"
          emissive="#38bdf8"
          emissiveIntensity={4}
          roughness={0.12}
          metalness={0.1}
          clearcoat={1}
        />
      </mesh>

      {/* Same-color electron aura */}
      <mesh
        ref={undefined}
        scale={2.5}
        onClick={(event) => {
          event.stopPropagation();

          onInspect?.({
            type: "electron",
            shell,
            orbital,
          });
        }}
      >
        <sphereGeometry
          args={[0.09, 20, 20]}
        />

        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.07}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}