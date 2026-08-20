import { useMemo, useState } from "react";

const orbitalBoxes = {
  s: 1,
  p: 3,
  d: 5,
  f: 7,
};

const orbitalCapacity = {
  s: 2,
  p: 6,
  d: 10,
  f: 14,
};

function getType(orbital) {
  return orbital.replace(/[0-9]/g, "");
}

function getShell(orbital) {
  return Number(
    orbital.replace(/[a-z]/g, "")
  );
}

function fillBoxes(electrons, boxCount) {
  const boxes = Array(boxCount).fill(0);

  let remaining = electrons;

  // Hund's rule:
  // first place one electron in each orbital
  for (
    let i = 0;
    i < boxCount && remaining > 0;
    i++
  ) {
    boxes[i] = 1;
    remaining--;
  }

  // Then pair electrons
  for (
    let i = 0;
    i < boxCount && remaining > 0;
    i++
  ) {
    boxes[i] = 2;
    remaining--;
  }

  return boxes;
}

export default function OrbitalDiagram({
  orbitals = [],
}) {
  const [selectedOrbital, setSelectedOrbital] =
    useState(null);

  const orbitalData = useMemo(() => {
    return orbitals.map((item) => {
      const type = getType(
        item.orbital
      );

      const boxCount =
        orbitalBoxes[type] || 1;

      return {
        ...item,

        type,

        shell: getShell(
          item.orbital
        ),

        boxCount,

        capacity:
          orbitalCapacity[type],

        boxes: fillBoxes(
          item.electrons,
          boxCount
        ),
      };
    });
  }, [orbitals]);

  const totalElectrons =
    orbitalData.reduce(
      (total, orbital) =>
        total + orbital.electrons,
      0
    );

  return (
    <div className="orbital-diagram">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="orbital-config-header">

        <div className="orbital-config-title">

          <div className="orbital-config-icon">
            e⁻
          </div>

          <div>

            <div className="configuration-label">
              ELECTRON CONFIGURATION
            </div>

            <h3>
              Orbital Structure
            </h3>

          </div>

        </div>

        <div className="electron-count-badge">
          <span>
            ELECTRONS
          </span>

          <strong>
            {totalElectrons}
          </strong>
        </div>

      </div>

      {/* =================================================
          LEGEND
      ================================================= */}

      <div className="orbital-legend">

        <div className="legend-item">

          <span className="legend-arrow">
            ↑
          </span>

          <span>
            Spin up
          </span>

        </div>

        <div className="legend-item">

          <span className="legend-arrow down">
            ↓
          </span>

          <span>
            Spin down
          </span>

        </div>

        <div className="legend-item">

          <span className="legend-box">
            2
          </span>

          <span>
            Filled orbital
          </span>

        </div>

      </div>

      {/* =================================================
          ENERGY LABEL
      ================================================= */}

      <div className="energy-indicator">

        <span>
          HIGHER ENERGY
        </span>

        <div className="energy-line" />

        <span>
          ↑
        </span>

      </div>

      {/* =================================================
          ORBITAL LIST
      ================================================= */}

      <div className="orbital-list">

        {orbitalData
          .slice()
          .reverse()
          .map((item) => {

            const isSelected =
              selectedOrbital ===
              item.orbital;

            return (
              <button
                type="button"
                key={item.orbital}
                className={`orbital-row ${
                  isSelected
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setSelectedOrbital(
                    isSelected
                      ? null
                      : item.orbital
                  )
                }
              >

                {/* ORBITAL NAME */}

                <div className="orbital-name-area">

                  <span className="orbital-name">
                    {item.orbital}
                  </span>

                  <span className="orbital-type">
                    {item.type.toUpperCase()}
                  </span>

                </div>

                {/* BOXES */}

                <div className="orbital-boxes">

                  {item.boxes.map(
                    (
                      electrons,
                      index
                    ) => (

                      <span
                        className={`orbital-box ${
                          electrons === 2
                            ? "filled"
                            : electrons === 1
                            ? "single"
                            : "empty"
                        }`}
                        key={index}
                      >

                        {electrons >=
                          1 && (
                          <span className="spin-up">
                            ↑
                          </span>
                        )}

                        {electrons >=
                          2 && (
                          <span className="spin-down">
                            ↓
                          </span>
                        )}

                      </span>

                    )
                  )}

                </div>

                {/* ELECTRON COUNT */}

                <div className="orbital-electron-count">

                  <strong>
                    {item.electrons}
                  </strong>

                  <span>
                    / {item.capacity}
                  </span>

                </div>

              </button>
            );
          })}

      </div>

      {/* =================================================
          SELECTED ORBITAL INLINE DETAIL
      ================================================= */}

      {selectedOrbital && (
        <div className="selected-orbital-strip">

          <div className="selected-orbital-symbol">
            {selectedOrbital}
          </div>

          <div className="selected-orbital-info">

            <strong>
              {getType(
                selectedOrbital
              ).toUpperCase()} SUBSHELL
            </strong>

            <span>
              Shell{" "}
              {getShell(
                selectedOrbital
              )}
            </span>

          </div>

          <div className="selected-orbital-capacity">

            <span>
              CAPACITY
            </span>

            <strong>
              {orbitalCapacity[
                getType(
                  selectedOrbital
                )
              ]}
            </strong>

          </div>

        </div>
      )}

      {/* =================================================
          PRINCIPLES
      ================================================= */}

      <div className="orbital-principles">

        <div className="principle">

          <div className="principle-number">
            01
          </div>

          <div>

            <strong>
              AUFBAU
            </strong>

            <span>
              Lower-energy orbitals
              fill first.
            </span>

          </div>

        </div>

        <div className="principle">

          <div className="principle-number">
            02
          </div>

          <div>

            <strong>
              HUND
            </strong>

            <span>
              Equal-energy orbitals
              fill singly before pairing.
            </span>

          </div>

        </div>

        <div className="principle">

          <div className="principle-number">
            03
          </div>

          <div>

            <strong>
              PAULI
            </strong>

            <span>
              Two electrons maximum
              per orbital.
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}