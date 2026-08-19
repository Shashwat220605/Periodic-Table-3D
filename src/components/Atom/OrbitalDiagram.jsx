import { useMemo, useState } from "react";

const orbitalCapacity = {
  s: 2,
  p: 6,
  d: 10,
  f: 14,
};

const orbitalBoxes = {
  s: 1,
  p: 3,
  d: 5,
  f: 7,
};

function getOrbitalType(orbital) {
  return orbital
    .replace(/[0-9]/g, "");
}

function getOrbitalNumber(orbital) {
  return Number(
    orbital.replace(/[a-z]/g, "")
  );
}

function buildElectrons(
  electrons,
  boxCount
) {
  const result = Array(
    boxCount
  ).fill(0);

  /*
   * Hund's rule:
   * fill each orbital singly first,
   * then start pairing.
   */

  let remaining = electrons;

  for (
    let i = 0;
    i < boxCount && remaining > 0;
    i++
  ) {
    result[i] = 1;
    remaining--;
  }

  for (
    let i = 0;
    i < boxCount && remaining > 0;
    i++
  ) {
    result[i] = 2;
    remaining--;
  }

  return result;
}

export default function OrbitalDiagram({
  orbitals = [],
}) {
  const [activeOrbital, setActiveOrbital] =
    useState(null);

  const grouped = useMemo(() => {
    return orbitals.map((orbital) => {
      const type =
        getOrbitalType(
          orbital.orbital
        );

      const number =
        getOrbitalNumber(
          orbital.orbital
        );

      const boxCount =
        orbitalBoxes[type];

      const electrons =
        buildElectrons(
          orbital.electrons,
          boxCount
        );

      return {
        ...orbital,
        type,
        number,
        boxCount,
        electrons,
      };
    });
  }, [orbitals]);

  return (
    <div className="orbital-diagram">

      <div className="orbital-header">

        <div>
          <span className="configuration-label">
            ELECTRON CONFIGURATION
          </span>

          <h3>
            Orbital Occupancy
          </h3>
        </div>

        <div className="orbital-legend">
          ↑↓
          <span>
            electron pair
          </span>
        </div>

      </div>

      <div className="energy-axis">
        <span>
          ENERGY
        </span>

        <span>
          ↑
        </span>
      </div>

      <div className="orbital-list">

        {grouped
          .slice()
          .reverse()
          .map((orbital) => (

            <div
              className={`orbital-row ${
                activeOrbital ===
                orbital.orbital
                  ? "active"
                  : ""
              }`}
              key={orbital.orbital}
              onMouseEnter={() =>
                setActiveOrbital(
                  orbital.orbital
                )
              }
              onMouseLeave={() =>
                setActiveOrbital(null)
              }
            >

              <div className="orbital-name">
                {orbital.orbital}
              </div>

              <div className="orbital-boxes">

                {orbital.electrons.map(
                  (
                    electrons,
                    index
                  ) => (

                    <div
                      className="orbital-box"
                      key={index}
                    >

                      {electrons >=
                        1 && (
                        <span className="electron-arrow">
                          ↑
                        </span>
                      )}

                      {electrons >=
                        2 && (
                        <span className="electron-arrow second">
                          ↓
                        </span>
                      )}

                    </div>

                  )
                )}

              </div>

              <div className="orbital-count">
                {orbital.electrons}
              </div>

            </div>

          ))}

      </div>

      {activeOrbital && (
        <div className="orbital-tooltip">

          <strong>
            {activeOrbital}
          </strong>

          <span>
            {getOrbitalType(
              activeOrbital
            ).toUpperCase()} orbital
          </span>

        </div>
      )}

      <div className="orbital-rules">

        <div>
          <strong>
            AUFBAU
          </strong>

          <span>
            Lower-energy orbitals
            fill first.
          </span>
        </div>

        <div>
          <strong>
            HUND
          </strong>

          <span>
            Electrons occupy
            equal-energy orbitals
            singly before pairing.
          </span>
        </div>

        <div>
          <strong>
            PAULI
          </strong>

          <span>
            Each orbital holds
            at most two electrons
            with opposite spins.
          </span>
        </div>

      </div>

    </div>
  );
}