import { Canvas, useThree } from "@react-three/fiber";
import OrbitalDiagram from "./components/Atom/OrbitalDiagram";

import {
  Environment,
  OrbitControls,
} from "@react-three/drei";

import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import gsap from "gsap";

import PeriodicTable from "./components/PeriodicTable/PeriodicTable";
import Atom from "./components/Atom/Atom";

import elements from "./data/elements";

import {
  getElectronConfiguration,
  getShellConfiguration,
} from "./data/electronConfiguration";

import "./index.css";

/* =========================================================
   CAMERA TRANSITION
========================================================= */

function CameraTransition({ active }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!active) return;

    gsap.killTweensOf(camera.position);

    gsap.to(camera.position, {
      x: 0,
      y: 1.5,
      z: 7.5,
      duration: 0.75,
      ease: "power2.inOut",
    });
  }, [active, camera]);

  return null;
}

/* =========================================================
   3D SCENE
========================================================= */

function Scene({
  element,
  mode,
  onSelect,
  transition,
  onInspect,
}) {
  return (
    <>
      {/* LIGHTING */}

      <ambientLight intensity={0.3} />

      <directionalLight
        position={[6, 10, 8]}
        intensity={3}
        castShadow
      />

      <pointLight
        position={[-6, 4, 5]}
        intensity={100}
        distance={30}
        color="#38bdf8"
      />

      <pointLight
        position={[7, 3, -5]}
        intensity={80}
        distance={28}
        color="#a78bfa"
      />

      {/* FEATURED ELEMENT */}

      {(mode === "home" || transition) &&
        element && (
          <group
            scale={
              transition
                ? 1 +
                  transition.progress * 1.8
                : 1
            }
          >
            <PeriodicTable
              element={element}
              onSelect={onSelect}
            />
          </group>
        )}

      {/* ATOM */}

      {mode === "atom" && element && (
        <Atom
          element={element}
          onInspect={onInspect}
        />
      )}

      {/* CAMERA */}

      <CameraTransition
        active={transition !== null}
      />

      {/* CONTROLS */}

      <OrbitControls
        enablePan={false}
        enableZoom={!transition}
        enabled={!transition}
        minDistance={4}
        maxDistance={18}
        enableDamping
        dampingFactor={0.08}
      />

      {/* ENVIRONMENT */}

      <Environment preset="studio" />

      {/* POST PROCESSING */}

      <EffectComposer>
        <Bloom
          intensity={
            mode === "atom"
              ? 1
              : 0.65
          }
          luminanceThreshold={0.25}
          luminanceSmoothing={0.7}
          mipmapBlur
        />

        <Vignette
          eskil={false}
          offset={0.25}
          darkness={0.65}
        />
      </EffectComposer>
    </>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

function App() {
  /* -------------------------------------------------------
     PAGE MODE
  ------------------------------------------------------- */

  const [mode, setMode] =
    useState("home");

  /* -------------------------------------------------------
     FEATURED ELEMENT
  ------------------------------------------------------- */

  const [index, setIndex] =
    useState(5);

  /* -------------------------------------------------------
     SELECTED ELEMENT
  ------------------------------------------------------- */

  const [selected, setSelected] =
    useState(null);

  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */

  const [search, setSearch] =
    useState("");

  /* -------------------------------------------------------
     TRANSITION
  ------------------------------------------------------- */

  const [transition, setTransition] =
    useState(null);

  /* -------------------------------------------------------
     INSPECTION
  ------------------------------------------------------- */

  const [inspection, setInspection] =
    useState(null);

  /* -------------------------------------------------------
     CURRENT FEATURED ELEMENT
  ------------------------------------------------------- */

  const featuredElement =
    elements[index];

  /* =======================================================
     SEARCH RESULTS
  ======================================================= */

  const filteredElements =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) return [];

      return elements
        .filter((element) => {
          return (
            element.name
              .toLowerCase()
              .includes(query) ||

            element.symbol
              .toLowerCase()
              .includes(query) ||

            String(element.number)
              .includes(query)
          );
        })
        .slice(0, 7);
    }, [search]);

  /* =======================================================
     REAL ELECTRON DATA FOR SELECTED ELEMENT
  ======================================================= */

  const selectedElectronData =
    selected
      ? getElectronConfiguration(
          selected.number
        )
      : null;

  const selectedShellData =
    selected
      ? getShellConfiguration(
          selected.number
        )
      : [];

  /* =======================================================
     AUTOMATIC HOMEPAGE ROTATION
  ======================================================= */

  useEffect(() => {
    if (mode !== "home") return;

    if (transition) return;

    const timer = setInterval(() => {
      setIndex(
        (current) =>
          (current + 1) %
          elements.length
      );
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [mode, transition]);

  /* =======================================================
     SELECT ELEMENT
  ======================================================= */

  const chooseElement = (element) => {
    if (!element) return;

    const elementIndex =
      elements.findIndex(
        (item) =>
          item.number ===
          element.number
      );

    if (elementIndex !== -1) {
      setIndex(elementIndex);
    }

    setSelected(element);

    setSearch("");
  };

  /* =======================================================
     ATOM TRANSITION
  ======================================================= */

  const startAtomTransition = (
    element
  ) => {
    if (!element) return;

    if (transition) return;

    setInspection(null);

    setSelected(element);

    const elementIndex =
      elements.findIndex(
        (item) =>
          item.number ===
          element.number
      );

    if (elementIndex !== -1) {
      setIndex(elementIndex);
    }

    const transitionObject = {
      progress: 0,
    };

    setTransition(
      transitionObject
    );

    gsap.to(
      transitionObject,
      {
        progress: 1,

        duration: 0.75,

        ease: "power2.inOut",

        onUpdate: () => {
          setTransition({
            progress:
              transitionObject.progress,
          });
        },

        onComplete: () => {
          setTransition(null);

          setMode("atom");
        },
      }
    );
  };

  /* =======================================================
     EXPLORE FEATURED ELEMENT
  ======================================================= */

  const exploreAtom = () => {
    startAtomTransition(
      featuredElement
    );
  };

  /* =======================================================
     SEARCH → DIRECT ATOM
  ======================================================= */

  const exploreDirectly = (
    element
  ) => {
    if (!element) return;

    setSearch("");

    startAtomTransition(element);
  };

  /* =======================================================
     BACK TO HOME
  ======================================================= */

  const backHome = () => {
    gsap.killTweensOf(
      document.body
    );

    setTransition(null);

    setInspection(null);

    setMode("home");

    setSelected(null);
  };

  /* =======================================================
     CHANGE ATOM
  ======================================================= */

  const changeAtom = (
    direction
  ) => {
    if (!selected) return;

    const currentIndex =
      elements.findIndex(
        (element) =>
          element.number ===
          selected.number
      );

    if (currentIndex === -1) return;

    const nextIndex =
      (currentIndex +
        direction +
        elements.length) %
      elements.length;

    const nextElement =
      elements[nextIndex];

    setIndex(nextIndex);

    setSelected(nextElement);

    setInspection(null);
  };

  /* =======================================================
     PREVIOUS ATOM
  ======================================================= */

  const previousAtom = () => {
    changeAtom(-1);
  };

  /* =======================================================
     NEXT ATOM
  ======================================================= */

  const nextAtom = () => {
    changeAtom(1);
  };

  /* =======================================================
     HOME NAVIGATION
  ======================================================= */

  const nextElement = () => {
    setIndex(
      (current) =>
        (current + 1) %
        elements.length
    );
  };

  const previousElement = () => {
    setIndex(
      (current) =>
        (current -
          1 +
          elements.length) %
        elements.length
    );
  };

  /* =======================================================
     INSPECTION HANDLER
  ======================================================= */

  const handleInspection = (
    data
  ) => {
    if (!data) return;

    setInspection(data);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="app">

      {/* =================================================
          TOP BAR
      ================================================= */}

      <header className="topbar">

        {/* BRAND */}

        <div className="brand">

          <div className="brand-mark">
            ◉
          </div>

          <div>

            <div className="brand-name">
              PERIODIC
            </div>

            <div className="brand-sub">
              EXPLORER
            </div>

          </div>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="search-wrapper">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search element, symbol or atomic number..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

          {/* SEARCH RESULTS */}

          {filteredElements.length >
            0 && (

            <div className="search-results">

              {filteredElements.map(
                (element) => (

                  <button
                    key={element.number}
                    onClick={() =>
                      exploreDirectly(
                        element
                      )
                    }
                  >

                    <span className="result-symbol">
                      {element.symbol}
                    </span>

                    <span>

                      <strong>
                        {element.name}
                      </strong>

                      <small>
                        Atomic number{" "}
                        {element.number}
                      </small>

                    </span>

                  </button>

                )
              )}

            </div>

          )}

        </div>

        {/* STATUS */}

        <div className="header-status">
          118 ELEMENTS
        </div>

      </header>

      {/* =================================================
          3D WORLD
      ================================================= */}

      <section className="scene-container">

        <Canvas
          shadows
          camera={{
            position: [
              0,
              0,
              10,
            ],
            fov: 40,
          }}
        >

          <color
            attach="background"
            args={[
              "#020617",
            ]}
          />

          <Scene
            element={
              mode === "atom"
                ? selected
                : featuredElement
            }
            mode={mode}
            onSelect={chooseElement}
            transition={
              transition
            }
            onInspect={
              handleInspection
            }
          />

        </Canvas>

      </section>

      {/* =================================================
          HOME PAGE
      ================================================= */}

      {mode === "home" &&
        !transition && (

        <>

          <section className="hero-content">

            <div className="hero-kicker">
              ELEMENT OF THE MOMENT
            </div>

            <div className="hero-number">

              {String(
                featuredElement.number
              ).padStart(
                2,
                "0"
              )}

            </div>

            <h1
              key={
                featuredElement.number
              }
              className="hero-title"
            >
              {featuredElement.name}
            </h1>

            <div className="hero-meta">

              <span>
                {featuredElement.symbol}
              </span>

              <span className="dot">
                •
              </span>

              <span>
                {featuredElement.mass} u
              </span>

              <span className="dot">
                •
              </span>

              <span>
                {featuredElement.category
                  .replaceAll(
                    "-",
                    " "
                  )
                  .toUpperCase()}
              </span>

            </div>

            <p className="hero-description">

              Explore the structure,
              properties and atomic
              composition of{" "}

              {featuredElement.name}.

            </p>

            <button
              className="primary-action"
              onClick={
                exploreAtom
              }
            >

              EXPLORE{" "}
              {featuredElement.symbol}

              <span>
                →
              </span>

            </button>

          </section>

          {/* HOME ELEMENT NAVIGATION */}

          <div className="element-navigation">

            <button
              onClick={
                previousElement
              }
            >
              ←
            </button>

            <div className="element-counter">

              <span>

                {String(
                  index + 1
                ).padStart(
                  3,
                  "0"
                )}

              </span>

              <div className="counter-line">

                <div
                  style={{
                    width: `${
                      ((index + 1) /
                        elements.length) *
                      100
                    }%`,
                  }}
                />

              </div>

              <span>
                118
              </span>

            </div>

            <button
              onClick={
                nextElement
              }
            >
              →
            </button>

          </div>

          <div className="auto-label">
            AUTO EXPLORATION ·
            CHANGING EVERY 5 SEC
          </div>

        </>
      )}

      {/* =================================================
          ATOM INFORMATION PANEL
      ================================================= */}

      {mode === "atom" &&
        selected && (

        <aside className="atom-panel">

          {/* BACK */}

          <button
            className="back-button"
            onClick={
              backHome
            }
          >
            ← BACK TO EXPLORER
          </button>

          {/* HEADER */}

          <div className="atom-eyebrow">
            ATOMIC STRUCTURE
          </div>

          <div className="atom-symbol">
            {selected.symbol}
          </div>

          <h2>
            {selected.name}
          </h2>

          <div className="atom-meta">

            {selected.category
              .replaceAll(
                "-",
                " "
              )
              .toUpperCase()}

            {" • "}

            PERIOD{" "}
            {selected.period}

          </div>

          {/* =================================================
              PARTICLE COUNTS
          ================================================= */}

          <div className="atom-stats">

            <div>

              <span>
                PROTONS
              </span>

              <strong>
                {selected.number}
              </strong>

            </div>

            <div>

              <span>
                NEUTRONS
              </span>

              <strong>

                {Math.max(
                  0,

                  Math.round(
                    Number(
                      selected.mass
                    )
                  ) -
                    selected.number
                )}

              </strong>

            </div>

            <div>

              <span>
                ELECTRONS
              </span>

              <strong>
                {selected.number}
              </strong>

            </div>

          </div>

          {/* =================================================
              ELEMENT DETAILS
          ================================================= */}

          <div className="atom-details">

            <div className="detail-row">

              <span>
                ATOMIC MASS
              </span>

              <strong>
                {selected.mass} u
              </strong>

            </div>

            <div className="detail-row">

              <span>
                ATOMIC NUMBER
              </span>

              <strong>
                {selected.number}
              </strong>

            </div>

            <div className="detail-row">

              <span>
                PERIOD
              </span>

              <strong>
                {selected.period}
              </strong>

            </div>

            <div className="detail-row">

              <span>
                GROUP
              </span>

              <strong>
                {selected.group ||
                  "—"}
              </strong>

            </div>

          </div>

          {/* =================================================
              ELECTRON CONFIGURATION
          ================================================= */}

          <div className="electron-configuration">

            <OrbitalDiagram
  orbitals={
    selectedElectronData?.orbitals
  }
/>

            <div className="configuration-label">
              ELECTRON CONFIGURATION
            </div>

            <div className="configuration-value">

              {
                selectedElectronData
                  ?.configuration
              }

            </div>

            {/* SHELL SUMMARY */}

            <div className="shell-summary">

              {selectedShellData.map(
                (shell) => (

                  <span
                    key={shell.shell}
                  >

                    {shell.shell}

                    <sup>
                      {shell.electrons}
                    </sup>

                  </span>

                )
              )}

            </div>

          </div>

          {/* MODEL LABEL */}

          <div className="atom-model-label">
            BOHR MODEL
          </div>

          <p className="atom-description">

            Click the nucleus, protons,
            neutrons or electrons to
            inspect their properties.

          </p>

          {/* =================================================
              ATOM NAVIGATION
          ================================================= */}

          <div className="atom-navigation">

            <button
              onClick={
                previousAtom
              }
              title="Previous element"
            >
              ←
            </button>

            <div>

              <span>

                {String(
                  selected.number
                ).padStart(
                  3,
                  "0"
                )}

              </span>

              <small>
                / 118
              </small>

            </div>

            <button
              onClick={
                nextAtom
              }
              title="Next element"
            >
              →
            </button>

          </div>

          {/* =================================================
              INSPECTION CARD
          ================================================= */}

          {inspection && (

            <div className="inspection-card">

              <button
                className="inspection-close"
                onClick={() =>
                  setInspection(null)
                }
              >
                ×
              </button>

              {/* NUCLEUS */}

              {inspection.type ===
                "nucleus" && (

                <>
                  <div className="inspection-label">
                    NUCLEUS
                  </div>

                  <h3>
                    Atomic Nucleus
                  </h3>

                  <p>
                    The dense central
                    region containing
                    the protons and
                    neutrons of the
                    atom.
                  </p>

                  <div className="inspection-grid">

                    <span>
                      PROTONS
                    </span>

                    <strong>
                      {selected.number}
                    </strong>

                    <span>
                      NEUTRONS
                    </span>

                    <strong>
                      {Math.max(
                        0,
                        Math.round(
                          Number(
                            selected.mass
                          )
                        ) -
                          selected.number
                      )}
                    </strong>

                  </div>
                </>

              )}

              {/* PROTON */}

              {inspection.type ===
                "proton" && (

                <>
                  <div className="inspection-label proton">
                    PROTON
                  </div>

                  <h3>
                    Proton
                  </h3>

                  <div className="inspection-grid">

                    <span>
                      CHARGE
                    </span>

                    <strong>
                      +1
                    </strong>

                    <span>
                      RELATIVE MASS
                    </span>

                    <strong>
                      1
                    </strong>

                    <span>
                      LOCATION
                    </span>

                    <strong>
                      Nucleus
                    </strong>

                  </div>

                  <p>
                    Positively charged
                    particle found
                    inside the nucleus.
                  </p>
                </>

              )}

              {/* NEUTRON */}

              {inspection.type ===
                "neutron" && (

                <>
                  <div className="inspection-label neutron">
                    NEUTRON
                  </div>

                  <h3>
                    Neutron
                  </h3>

                  <div className="inspection-grid">

                    <span>
                      CHARGE
                    </span>

                    <strong>
                      0
                    </strong>

                    <span>
                      RELATIVE MASS
                    </span>

                    <strong>
                      1
                    </strong>

                    <span>
                      LOCATION
                    </span>

                    <strong>
                      Nucleus
                    </strong>

                  </div>

                  <p>
                    Electrically neutral
                    particle found inside
                    the nucleus.
                  </p>
                </>

              )}

              {/* ELECTRON */}

              {inspection.type ===
                "electron" && (

                <>
                  <div className="inspection-label electron">
                    ELECTRON
                  </div>

                  <h3>
                    Electron
                  </h3>

                  <div className="inspection-grid">

                    <span>
                      CHARGE
                    </span>

                    <strong>
                      −1
                    </strong>

                    <span>
                      MASS
                    </span>

                    <strong>
                      0.0005486 u
                    </strong>

                    <span>
                      SHELL
                    </span>

                    <strong>
                      {inspection.shell}
                    </strong>

                    <span>
                      ORBITAL
                    </span>

                    <strong>
                      {inspection.orbital}
                    </strong>

                  </div>

                  <p>
                    A negatively charged
                    elementary particle
                    associated with the
                    atom's electron cloud.
                  </p>
                </>

              )}

            </div>

          )}

        </aside>

      )}

    </main>
  );
}

export default App;