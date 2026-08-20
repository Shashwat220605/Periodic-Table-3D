import { useMemo } from "react";
import { Html, Text } from "@react-three/drei";
import OrbitalDiagram from "./OrbitalDiagram";

import Nucleus from "./Nucleus";
import ElectronShell from "./ElectronShell";

import {
  getElectronConfiguration,
  getShellConfiguration,
} from "../../data/electronConfiguration";

export default function Atom({
  element,
  onInspect,
}) {
  const configuration = useMemo(
    () => getElectronConfiguration(element.number),
    [element.number]
  );

  const shells = useMemo(
    () => getShellConfiguration(element.number),
    [element.number]
  );

  const neutrons = Math.max(
    0,
    Math.round(Number(element.mass)) - element.number
  );

  const legendStyle = {
    width: "min(420px, 72vw)",
    padding: "10px 13px",
    border: "1px solid rgba(148,163,184,.16)",
    borderRadius: "12px",
    background: "rgba(2,6,23,.86)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 12px 35px rgba(0,0,0,.35)",
    color: "#cbd5e1",
    fontFamily: "Inter, system-ui, sans-serif",
    pointerEvents: "auto",
  };

  return (
    <group>
      <Nucleus
        protons={element.number}
        neutrons={neutrons}
        onInspect={onInspect}
      />

      {shells.map((shell, index) => (
        <ElectronShell
          key={shell.shell}
          shell={1.5 + index * 0.75}
          orbital={
            configuration.orbitals?.find(
              (orbital) => Number(orbital.orbital[0]) === shell.shell
            )?.orbital || `Shell ${shell.shell}`
          }
          count={shell.electrons}
          speed={1.4 / (index + 1)}
          inclination={index % 2 === 0 ? 0 : Math.PI * 0.35}
          onInspect={onInspect}
        />
      ))}

      {/* LIVE PARTICLE CLASSIFICATION */}
      <Html
        position={[0, 3.45, 0]}
        center
        distanceFactor={8}
        zIndexRange={[10, 20]}
      >
        <div
          style={legendStyle}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div style={{
            fontSize: "7px",
            fontWeight: 800,
            letterSpacing: ".18em",
            color: "#64748b",
            marginBottom: "8px",
          }}>
            LIVE ATOMIC MODEL · PARTICLE KEY
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 10px #ef4444", flexShrink: 0 }} />
              <span>
                <b style={{ display: "block", fontSize: "7px", color: "#fca5a5" }}>PROTON</b>
                <small style={{ display: "block", fontSize: "5px", color: "#64748b" }}>+1 · NUCLEUS</small>
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#64748b", boxShadow: "0 0 8px rgba(100,116,139,.7)", flexShrink: 0 }} />
              <span>
                <b style={{ display: "block", fontSize: "7px", color: "#cbd5e1" }}>NEUTRON</b>
                <small style={{ display: "block", fontSize: "5px", color: "#64748b" }}>0 · NUCLEUS</small>
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#38bdf8", boxShadow: "0 0 12px #38bdf8", flexShrink: 0 }} />
              <span>
                <b style={{ display: "block", fontSize: "7px", color: "#7dd3fc" }}>ELECTRON</b>
                <small style={{ display: "block", fontSize: "5px", color: "#64748b" }}>−1 · ORBITING</small>
              </span>
            </div>
          </div>
        </div>
      </Html>

      <group position={[0, -4.3, 0]} />

      <group position={[0, -3.2, 0]}>
        <Text
          fontSize={0.45}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {element.symbol}
        </Text>

        <Text
          position={[0, -0.45, 0]}
          fontSize={0.18}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          {element.name}
        </Text>
      </group>
    </group>
  );
}