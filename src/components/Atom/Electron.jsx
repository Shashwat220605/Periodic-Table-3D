import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Electron({ radius, speed, offset = 0, inclination = 0, shell, orbital, onInspect, energyMode = "stable" }) {
  const ref = useRef();
  const auraRef = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const time = clock.elapsedTime * speed + offset;
    ref.current.position.x = Math.cos(time) * radius;
    ref.current.position.z = Math.sin(time) * radius;
    if (auraRef.current) {
      const pulse = 2.2 + Math.sin(clock.elapsedTime * 5 + offset) * 0.35;
      auraRef.current.scale.setScalar(pulse);
      auraRef.current.material.opacity = energyMode === "stable" ? 0.055 : 0.11;
    }
  });
  const glow = energyMode === "ionized" ? "#f59e0b" : energyMode === "excited" ? "#c084fc" : "#38bdf8";
  return <group rotation={[inclination, 0, 0]}>
    <mesh ref={ref} onClick={(event) => { event.stopPropagation(); onInspect?.({ type: "electron", shell, orbital }); }} onPointerEnter={() => { document.body.style.cursor = "pointer"; }} onPointerLeave={() => { document.body.style.cursor = "default"; }}>
      <sphereGeometry args={[0.095, 32, 32]} />
      <meshPhysicalMaterial color={glow} emissive={glow} emissiveIntensity={energyMode === "stable" ? 4 : 7} roughness={0.08} metalness={0.08} clearcoat={1} />
    </mesh>
    <mesh ref={auraRef} onClick={(event) => { event.stopPropagation(); onInspect?.({ type: "electron", shell, orbital }); }}>
      <sphereGeometry args={[0.095, 20, 20]} />
      <meshBasicMaterial color={glow} transparent opacity={0.07} depthWrite={false} />
    </mesh>
  </group>;
}