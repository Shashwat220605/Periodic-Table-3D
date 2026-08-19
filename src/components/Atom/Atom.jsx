import { useMemo } from "react";
import { Text } from "@react-three/drei";
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
  const configuration =
    useMemo(
      () =>
        getElectronConfiguration(
          element.number
        ),
      [element.number]
    );

  const shells =
    useMemo(
      () =>
        getShellConfiguration(
          element.number
        ),
      [element.number]
    );

  const neutrons =
    Math.max(
      0,
      Math.round(
        Number(element.mass)
      ) - element.number
    );

  return (
    <group>

      {/* NUCLEUS */}

      <Nucleus
        protons={
          element.number
        }
        neutrons={neutrons}
        onInspect={
          onInspect
        }
      />

      {/* ELECTRON SHELLS */}

      {shells.map(
        (shell, index) => (
          <ElectronShell
            key={shell.shell}
            shell={
              1.5 +
              index * 0.75
            }
            orbital={
              configuration
                .orbitals?.find(
                  (orbital) =>
                    Number(
                      orbital.orbital[0]
                    ) ===
                    shell.shell
                )?.orbital ||
              `Shell ${shell.shell}`
            }
            count={
              shell.electrons
            }
            speed={
              1.4 /
              (index + 1)
            }
            inclination={
              index % 2 === 0
                ? 0
                : Math.PI * 0.35
            }
            onInspect={
              onInspect
            }
          />
        )
      )}

      <group
  position={[
    0,
    -4.3,
    0,
  ]}
>
  {/* 3D atom remains above */}
</group>

      {/* LABEL */}

      <group
        position={[
          0,
          -3.2,
          0,
        ]}
      >
        <Text
          fontSize={0.45}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {element.symbol}
        </Text>

        <Text
          position={[
            0,
            -0.45,
            0,
          ]}
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