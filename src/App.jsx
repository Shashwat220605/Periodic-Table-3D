import { Canvas, useThree } from "@react-three/fiber";
import OrbitalDiagram from "./components/Atom/OrbitalDiagram";
import { Environment, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import PeriodicTable from "./components/PeriodicTable/PeriodicTable";
import Atom from "./components/Atom/Atom";
import ElementDossier from "./components/ElementDossier/ElementDossier";
import elements from "./data/elements";
import { getElectronConfiguration, getShellConfiguration } from "./data/electronConfiguration";
import "./index.css";
import "./components/ElementDossier/dossierLayout.css";

function CameraTransition({ active }) {
  const { camera } = useThree();
  useEffect(() => {
    if (!active) return;
    gsap.killTweensOf(camera.position);
    gsap.to(camera.position, { x: 0, y: 1.5, z: 7.5, duration: 0.75, ease: "power2.inOut" });
  }, [active, camera]);
  return null;
}

function Scene({ element, mode, onSelect, transition, onInspect }) {
  return <>
    <ambientLight intensity={0.3} />
    <directionalLight position={[6, 10, 8]} intensity={3} castShadow />
    <pointLight position={[-6, 4, 5]} intensity={100} distance={30} color="#38bdf8" />
    <pointLight position={[7, 3, -5]} intensity={80} distance={28} color="#a78bfa" />
    {(mode === "home" || transition) && element && <group scale={transition ? 1 + transition.progress * 1.8 : 1}><PeriodicTable element={element} onSelect={onSelect} /></group>}
    {mode === "atom" && element && <Atom element={element} onInspect={onInspect} />}
    <CameraTransition active={transition !== null} />
    <OrbitControls enablePan={false} enableZoom={!transition} enabled={!transition} minDistance={4} maxDistance={18} enableDamping dampingFactor={0.08} />
    <Environment preset="studio" />
    <EffectComposer>
      <Bloom intensity={mode === "atom" ? 1 : 0.65} luminanceThreshold={0.25} luminanceSmoothing={0.7} mipmapBlur />
      <Vignette eskil={false} offset={0.25} darkness={0.65} />
    </EffectComposer>
  </>;
}

function App() {
  const [mode, setMode] = useState("home");
  const [index, setIndex] = useState(5);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [transition, setTransition] = useState(null);
  const [inspection, setInspection] = useState(null);
  const [dossierElement, setDossierElement] = useState(null);
  const featuredElement = elements[index];

  const filteredElements = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return elements.filter(element => element.name.toLowerCase().includes(query) || element.symbol.toLowerCase().includes(query) || String(element.number).includes(query)).slice(0, 7);
  }, [search]);

  const selectedElectronData = selected ? getElectronConfiguration(selected.number) : null;
  const selectedShellData = selected ? getShellConfiguration(selected.number) : [];

  useEffect(() => {
    if (mode !== "home" || transition) return;
    const timer = setInterval(() => setIndex(current => (current + 1) % elements.length), 5000);
    return () => clearInterval(timer);
  }, [mode, transition]);

  const chooseElement = element => {
    if (!element) return;
    const elementIndex = elements.findIndex(item => item.number === element.number);
    if (elementIndex !== -1) setIndex(elementIndex);
    setSelected(element);
    setSearch("");
  };

  const startAtomTransition = element => {
    if (!element || transition) return;
    setInspection(null);
    setSelected(element);
    const elementIndex = elements.findIndex(item => item.number === element.number);
    if (elementIndex !== -1) setIndex(elementIndex);
    const transitionObject = { progress: 0 };
    setTransition(transitionObject);
    gsap.to(transitionObject, {
      progress: 1,
      duration: 0.75,
      ease: "power2.inOut",
      onUpdate: () => setTransition({ progress: transitionObject.progress }),
      onComplete: () => { setTransition(null); setMode("atom"); },
    });
  };

  const exploreAtom = () => startAtomTransition(featuredElement);
  const exploreDirectly = element => { if (!element) return; setSearch(""); startAtomTransition(element); };
  const backHome = () => { gsap.killTweensOf(document.body); setTransition(null); setInspection(null); setMode("home"); setSelected(null); };
  const handleInspection = data => { if (data) setInspection(data); };

  return <main className="app">
    <header className="topbar">
      <div className="brand"><div className="brand-mark">◉</div><div><div className="brand-name">PERIODIC</div><div className="brand-sub">EXPLORER</div></div></div>
      <div className="search-wrapper">
        <span className="search-icon">⌕</span>
        <input type="text" placeholder="Search element, symbol or atomic number..." value={search} onChange={event => setSearch(event.target.value)} />
        {filteredElements.length > 0 && <div className="search-results">{filteredElements.map(element => <button key={element.number} onClick={() => exploreDirectly(element)}><span className="result-symbol">{element.symbol}</span><span><strong>{element.name}</strong><small>Atomic number {element.number}</small></span></button>)}</div>}
      </div>
      <div className="header-status">118 ELEMENTS</div>
    </header>

    <section className="scene-container">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 40 }}>
        <color attach="background" args={["#020617"]} />
        <Scene element={mode === "atom" ? selected : featuredElement} mode={mode} onSelect={chooseElement} transition={transition} onInspect={handleInspection} />
      </Canvas>
    </section>

    {mode === "home" && !transition && <section className="hero-content">
      <div className="hero-kicker">ELEMENT OF THE MOMENT</div>
      <div className="hero-number">{String(featuredElement.number).padStart(2, "0")}</div>
      <h1 key={featuredElement.number} className="hero-title">{featuredElement.name}</h1>
      <div className="hero-meta"><span>{featuredElement.symbol}</span><span className="dot">•</span><span>{featuredElement.mass} u</span><span className="dot">•</span><span>{featuredElement.category.replaceAll("-", " ").toUpperCase()}</span></div>
      <p className="hero-description">Explore the structure, properties and atomic composition of {featuredElement.name}.</p>
      <div className="hero-actions">
        <button className="primary-action" onClick={exploreAtom}>EXPLORE {featuredElement.symbol}<span>→</span></button>
        <button className="dossier-action" onClick={() => setDossierElement(featuredElement)}>ELEMENT DOSSIER<span>↗</span></button>
      </div>
    </section>}

    {mode === "atom" && selected && <aside className="atom-panel">
      <button className="back-button" onClick={backHome}>← BACK TO EXPLORER</button>
      <div className="atom-eyebrow">ATOMIC STRUCTURE</div>
      <div className="atom-symbol">{selected.symbol}</div>
      <h2>{selected.name}</h2>
      <div className="atom-meta">{selected.category.replaceAll("-", " ").toUpperCase()} • PERIOD {selected.period}</div>
      <div className="atom-stats"><div><span>PROTONS</span><strong>{selected.number}</strong></div><div><span>NEUTRONS</span><strong>{Math.max(0, Math.round(Number(selected.mass)) - selected.number)}</strong></div><div><span>ELECTRONS</span><strong>{selected.number}</strong></div></div>
      <div className="atom-details">
        <div className="detail-row"><span>ATOMIC MASS</span><strong>{selected.mass} u</strong></div>
        <div className="detail-row"><span>ATOMIC NUMBER</span><strong>{selected.number}</strong></div>
        <div className="detail-row"><span>PERIOD</span><strong>{selected.period}</strong></div>
        <div className="detail-row"><span>GROUP</span><strong>{selected.group || "—"}</strong></div>
      </div>
      <button className="atom-dossier-button" onClick={() => setDossierElement(selected)}>OPEN ELEMENT DOSSIER <span>↗</span></button>
      <div className="electron-configuration">
        <OrbitalDiagram orbitals={selectedElectronData?.orbitals} />
        <div className="configuration-label">ELECTRON CONFIGURATION</div>
        <div className="configuration-value">{selectedElectronData?.configuration}</div>
        <div className="shell-summary">{selectedShellData.map(shell => <span key={shell.shell}>{shell.shell}<sup>{shell.electrons}</sup></span>)}</div>
      </div>
      <div className="atom-model-label">BOHR MODEL</div>
      <p className="atom-description">Click the nucleus, protons, neutrons or electrons to inspect their properties.</p>
      {inspection && <div className="inspection-card"><button className="inspection-close" onClick={() => setInspection(null)}>×</button>{inspection.type === "nucleus" && <><div className="inspection-label">NUCLEUS</div><h3>Atomic Nucleus</h3><p>The dense central region containing the protons and neutrons of the atom.</p></>}{inspection.type === "proton" && <><div className="inspection-label proton">PROTON</div><h3>Proton</h3><p>Positively charged particle found inside the nucleus.</p></>}{inspection.type === "neutron" && <><div className="inspection-label neutron">NEUTRON</div><h3>Neutron</h3><p>Electrically neutral particle found inside the nucleus.</p></>}{inspection.type === "electron" && <><div className="inspection-label electron">ELECTRON</div><h3>Electron</h3><p>A negatively charged elementary particle associated with the atom's electron cloud.</p></>}</div>}
    </aside>}

    {dossierElement && <ElementDossier element={dossierElement} onClose={() => setDossierElement(null)} />}
  </main>;
}

export default App;
