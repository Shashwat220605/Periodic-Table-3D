import { useMemo, useRef, useState } from "react";
import { Html, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import Nucleus from "./Nucleus";
import ElectronShell from "./ElectronShell";
import { getElectronConfiguration, getShellConfiguration } from "../../data/electronConfiguration";
import "./atomPhysics.css";

function AtomicField({ intensity }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * 0.08;
    const pulse = 1 + Math.sin(t * 1.8) * 0.025 * intensity;
    ref.current.scale.setScalar(pulse);
    ref.current.material.opacity = 0.035 + Math.sin(t * 1.8) * 0.012 * intensity;
  });
  return <mesh ref={ref}><sphereGeometry args={[1.18, 48, 48]} /><meshBasicMaterial color="#38bdf8" transparent opacity={0.035} depthWrite={false} wireframe /></mesh>;
}

function EnergyWave({ radius, speed, color = "#38bdf8", delay = 0, intensity = 1 }) {
  const ref = useRef();
  const innerRef = useRef();
  useFrame(({ clock }) => {
    if (!ref.current || !innerRef.current) return;
    const t = clock.elapsedTime * speed + delay;
    const phase = t % 1;
    const eased = 1 - Math.pow(1 - phase, 2);
    const scale = radius * (0.72 + eased * 0.48);
    ref.current.scale.setScalar(scale);
    innerRef.current.scale.setScalar(scale * 0.94);
    const fade = Math.sin(phase * Math.PI);
    ref.current.material.opacity = fade * 0.2 * intensity;
    innerRef.current.material.opacity = fade * 0.055 * intensity;
    ref.current.rotation.x = t * 0.12;
    ref.current.rotation.y = t * 0.2;
    innerRef.current.rotation.x = -t * 0.09;
    innerRef.current.rotation.z = t * 0.14;
  });
  return <group>
    <mesh ref={ref}><sphereGeometry args={[1, 48, 48]} /><meshBasicMaterial color={color} transparent opacity={0.1} wireframe depthWrite={false} /></mesh>
    <mesh ref={innerRef}><sphereGeometry args={[1, 24, 24]} /><meshBasicMaterial color={color} transparent opacity={0.04} wireframe depthWrite={false} /></mesh>
  </group>;
}

export default function Atom({ element, onInspect }) {
  const [energyMode, setEnergyMode] = useState("stable");
  const configuration = useMemo(() => getElectronConfiguration(element.number), [element.number]);
  const shells = useMemo(() => getShellConfiguration(element.number), [element.number]);
  const neutrons = Math.max(0, Math.round(Number(element.mass)) - element.number);
  const energyMultiplier = energyMode === "excited" ? 1.9 : energyMode === "ionized" ? 2.6 : 1;
  const waveIntensity = energyMode === "stable" ? 0.72 : energyMode === "excited" ? 1.15 : 1.55;

  return <group>
    <AtomicField intensity={energyMultiplier} />
    <EnergyWave radius={1.65} speed={0.28 * energyMultiplier} delay={0} intensity={waveIntensity} />
    <EnergyWave radius={2.25} speed={0.22 * energyMultiplier} delay={0.38} color="#a78bfa" intensity={waveIntensity * 0.9} />
    <EnergyWave radius={2.9} speed={0.17 * energyMultiplier} delay={0.72} color="#38bdf8" intensity={waveIntensity * 0.72} />
    <Nucleus protons={element.number} neutrons={neutrons} onInspect={onInspect} />
    {shells.map((shell, index) => <ElectronShell key={shell.shell} shell={1.5 + index * 0.75} orbital={configuration.orbitals?.find((orbital) => Number(orbital.orbital[0]) === shell.shell)?.orbital || `Shell ${shell.shell}`} count={shell.electrons} speed={(1.4 / (index + 1)) * energyMultiplier} inclination={index % 2 === 0 ? 0 : Math.PI * 0.35} onInspect={onInspect} energyMode={energyMode} />)}

    <Html position={[0, 3.45, 0]} center distanceFactor={8} zIndexRange={[10, 20]}>
      <div className="atom-live-model" onPointerDown={(event) => event.stopPropagation()}>
        <div className="live-title">LIVE ATOMIC MODEL · PARTICLE KEY</div>
        <div className="live-grid">
          <div className="live-particle"><span className="particle-dot" style={{ background: "#ef4444", boxShadow: "0 0 12px #ef4444" }} /><span><b style={{ color: "#fca5a5" }}>PROTON</b><small>+1 · NUCLEUS</small></span></div>
          <div className="live-particle"><span className="particle-dot" style={{ background: "#94a3b8", boxShadow: "0 0 10px rgba(148,163,184,.7)" }} /><span><b style={{ color: "#e2e8f0" }}>NEUTRON</b><small>0 · NUCLEUS</small></span></div>
          <div className="live-particle"><span className="particle-dot" style={{ background: "#38bdf8", boxShadow: "0 0 14px #38bdf8" }} /><span><b style={{ color: "#7dd3fc" }}>ELECTRON</b><small>−1 · ORBITAL</small></span></div>
        </div>
      </div>
    </Html>

    <Html position={[0, -3.8, 0]} center distanceFactor={8} zIndexRange={[20, 30]}>
      <div className="atom-physics-controls" onPointerDown={(event) => event.stopPropagation()}>
        <div><span>ENERGY STATE</span><b>{energyMode.toUpperCase()}</b></div>
        <div className="atom-physics-buttons"><button className={energyMode === "stable" ? "active" : ""} onClick={() => setEnergyMode("stable")}>STABLE</button><button className={energyMode === "excited" ? "active" : ""} onClick={() => setEnergyMode("excited")}>EXCITED</button><button className={energyMode === "ionized" ? "active" : ""} onClick={() => setEnergyMode("ionized")}>IONIZED</button></div>
        <small>{energyMode === "stable" ? "Ground-state motion" : energyMode === "excited" ? "Faster visualized orbital motion" : "High-energy ionization mode"}</small>
      </div>
    </Html>
    <group position={[0, -3.2, 0]}><Text fontSize={0.45} color="white" anchorX="center" anchorY="middle">{element.symbol}</Text><Text position={[0, -0.45, 0]} fontSize={0.18} color="#94a3b8" anchorX="center" anchorY="middle">{element.name}</Text></group>
  </group>;
}
