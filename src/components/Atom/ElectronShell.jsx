import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import Electron from "./Electron";

export default function ElectronShell({ shell, orbital, count, speed, inclination = 0, onInspect, energyMode = "stable" }) {
  const ringRef = useRef();
  const electrons = useMemo(() => Array.from({ length: count }, (_, index) => ({ offset: (index / Math.max(count, 1)) * Math.PI * 2 })), [count]);
  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.25 + shell) * 0.035;
    ringRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.18 + shell) * 0.025;
  });
  const ringColor = energyMode === "ionized" ? "#f59e0b" : energyMode === "excited" ? "#a78bfa" : "#38bdf8";
  return <group rotation={[inclination, 0, 0]}>
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[shell, energyMode === "stable" ? 0.009 : 0.015, 10, 160]} />
      <meshBasicMaterial color={ringColor} transparent opacity={energyMode === "stable" ? 0.16 : 0.28} />
    </mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} scale={1.035}>
      <torusGeometry args={[shell, 0.004, 8, 160]} />
      <meshBasicMaterial color={ringColor} transparent opacity={0.12} />
    </mesh>
    {electrons.map((electron, index) => <Electron key={index} radius={shell} speed={speed} offset={electron.offset} inclination={0} shell={shell} orbital={orbital} onInspect={onInspect} energyMode={energyMode} />)}
  </group>;
}