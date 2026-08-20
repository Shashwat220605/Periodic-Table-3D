import { useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import "./CombinationLab.css";

const ELEMENTS = [
  { symbol: "H", name: "Hydrogen", color: "#e2e8f0" },
  { symbol: "O", name: "Oxygen", color: "#fb7185" },
  { symbol: "C", name: "Carbon", color: "#64748b" },
  { symbol: "N", name: "Nitrogen", color: "#60a5fa" },
  { symbol: "Na", name: "Sodium", color: "#fbbf24" },
  { symbol: "Cl", name: "Chlorine", color: "#a3e635" },
];

const PRESETS = {
  H2O: { formula: "H₂O", name: "Water", atoms: ["H", "H", "O"], bond: "Polar covalent" },
  CO2: { formula: "CO₂", name: "Carbon dioxide", atoms: ["O", "C", "O"], bond: "Polar covalent" },
  CH4: { formula: "CH₄", name: "Methane", atoms: ["C", "H", "H", "H", "H"], bond: "Covalent" },
  NH3: { formula: "NH₃", name: "Ammonia", atoms: ["N", "H", "H", "H"], bond: "Polar covalent" },
  O2: { formula: "O₂", name: "Oxygen", atoms: ["O", "O"], bond: "Nonpolar covalent" },
  N2: { formula: "N₂", name: "Nitrogen", atoms: ["N", "N"], bond: "Triple covalent" },
  NaCl: { formula: "NaCl", name: "Sodium chloride", atoms: ["Na", "Cl"], bond: "Ionic" },
};

function Molecule({ atoms }) {
  const positions = useMemo(() => {
    if (atoms.length === 2) return [[-0.9, 0, 0], [0.9, 0, 0]];
    if (atoms.length === 3) return [[-1.05, 0, 0], [0, 0, 0], [1.05, 0, 0]];
    if (atoms.length === 4) return [[0, 0.75, 0], [-0.8, -0.25, 0], [0.8, -0.25, 0], [0, 0, 0.9]];
    return [[0, 0, 0], [-0.85, 0.45, 0], [0.85, 0.45, 0], [-0.65, -0.75, 0], [0.65, -0.75, 0]];
  }, [atoms.length]);

  const center = positions[Math.floor(positions.length / 2)];

  return (
    <group>
      {positions.map((p, i) => {
        const data = ELEMENTS.find((e) => e.symbol === atoms[i]) || ELEMENTS[0];
        return (
          <group key={`${atoms[i]}-${i}`} position={p}>
            <mesh>
              <sphereGeometry args={[atoms[i] === "H" ? 0.27 : 0.42, 48, 48]} />
              <meshPhysicalMaterial color={data.color} roughness={0.18} metalness={0.08} clearcoat={1} emissive={data.color} emissiveIntensity={0.08} />
            </mesh>
            <Text position={[0, -0.62, 0]} fontSize={0.2} color="#cbd5e1" anchorX="center">{atoms[i]}</Text>
          </group>
        );
      })}
      {positions.slice(0, -1).map((p, i) => {
        const q = positions[i + 1];
        const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2];
        const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2];
        return (
          <mesh key={`bond-${i}`} position={mid} rotation={[0, Math.atan2(dz, Math.sqrt(dx * dx + dy * dy)), -Math.atan2(dy, dx)]}>
            <cylinderGeometry args={[0.055, 0.055, length, 16]} />
            <meshStandardMaterial color="#94a3b8" emissive="#475569" emissiveIntensity={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function CombinationLab() {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState("H2O");
  const molecule = PRESETS[preset];

  return (
    <>
      <button className="lab-launcher" onClick={() => setOpen(true)}><span>🧪</span><div><small>CHEMISTRY</small><b>COMBINATION LAB</b></div></button>
      {open && (
        <div className="lab-overlay">
          <div className="lab-panel">
            <div className="lab-header">
              <div><small>MOLECULAR EXPLORATION</small><h2>Combination Lab</h2><p>Combine atoms and inspect common molecular structures in 3D.</p></div>
              <button onClick={() => setOpen(false)}>×</button>
            </div>
            <div className="lab-layout">
              <div className="molecule-canvas"><Canvas camera={{ position: [0, 0, 6], fov: 45 }}><ambientLight intensity={1.2} /><pointLight position={[3, 4, 5]} intensity={25} /><Molecule atoms={molecule.atoms} /><OrbitControls enablePan={false} /></Canvas></div>
              <div className="lab-info"><div className="lab-label">COMPOUND</div><h3>{molecule.formula}</h3><strong>{molecule.name}</strong><div className="lab-stat"><span>ATOMS</span><b>{molecule.atoms.length}</b></div><div className="lab-stat"><span>BONDING</span><b>{molecule.bond}</b></div><div className="preset-grid">{Object.keys(PRESETS).map((key) => <button className={key === preset ? "selected" : ""} key={key} onClick={() => setPreset(key)}>{PRESETS[key].formula}</button>)}</div></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
