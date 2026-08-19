import Proton from "./Proton";
import Neutron from "./Neutron";

function generateParticlePositions(count) {
  const positions = [];

  if (count === 0) return positions;

  const goldenAngle =
    Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y =
      1 -
      (i / Math.max(count - 1, 1)) * 2;

    const radius =
      Math.sqrt(
        Math.max(0, 1 - y * y)
      );

    const theta =
      goldenAngle * i;

    positions.push([
      Math.cos(theta) *
        radius *
        0.65,

      y * 0.65,

      Math.sin(theta) *
        radius *
        0.65,
    ]);
  }

  return positions;
}

export default function Nucleus({
  protons,
  neutrons,
  onInspect,
}) {
  const protonPositions =
    generateParticlePositions(
      protons
    );

  const neutronPositions =
    generateParticlePositions(
      neutrons
    );

  return (
    <group
      onClick={(event) => {
        event.stopPropagation();

        onInspect?.({
          type: "nucleus",
        });
      }}
    >
      {/* Nucleus aura */}
      <mesh scale={1.15}>
        <sphereGeometry
          args={[0.9, 48, 48]}
        />

        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={0.035}
          depthWrite={false}
        />
      </mesh>

      {protonPositions.map(
        (position, index) => (
          <Proton
            key={`p-${index}`}
            position={position}
            onInspect={onInspect}
            index={index}
          />
        )
      )}

      {neutronPositions.map(
        (position, index) => (
          <Neutron
            key={`n-${index}`}
            position={[
              position[0] + 0.12,
              position[1],
              position[2] + 0.08,
            ]}
            onInspect={onInspect}
            index={index}
          />
        )
      )}
    </group>
  );
}