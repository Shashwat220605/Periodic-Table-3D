import { useMemo } from "react";
import Electron from "./Electron";

export default function ElectronShell({
  shell,
  orbital,
  count,
  speed,
  inclination = 0,
  onInspect,
}) {
  const electrons = useMemo(() => {
    return Array.from(
      { length: count },
      (_, index) => ({
        offset:
          (index / count) *
          Math.PI *
          2,
      })
    );
  }, [count]);

  return (
    <group>
      {/* Orbital path */}
      <mesh
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
      >
        <torusGeometry
          args={[
            shell,
            0.008,
            8,
            128,
          ]}
        />

        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.13}
        />
      </mesh>

      {electrons.map(
        (electron, index) => (
          <Electron
            key={index}
            radius={shell}
            speed={speed}
            offset={
              electron.offset
            }
            inclination={
              inclination
            }
            shell={shell}
            orbital={orbital}
            onInspect={
              onInspect
            }
          />
        )
      )}
    </group>
  );
}