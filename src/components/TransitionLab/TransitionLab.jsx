import { useMemo, useState } from "react";
import "./transitionLab.css";

const LEVELS = [1, 2, 3, 4, 5];

export default function TransitionLab() {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(2);
  const transition = useMemo(() => {
    if (from === to) return null;
    const delta = Math.abs(13.6 * (1 / (to * to) - 1 / (from * from)));
    const absorption = to > from;
    const wavelength = delta > 0 ? 1239.84 / delta : 0;
    return { delta, absorption, wavelength };
  }, [from, to]);

  const setTarget = value => {
    if (value === from) return;
    setTo(value);
  };

  return <>
    <button className="transition-lab-launcher" onClick={() => setOpen(value => !value)}>
      <span className="transition-lab-icon">↕</span> TRANSITION LAB
    </button>

    {open && <section className="transition-lab-panel">
      <div className="transition-lab-header">
        <div><span className="transition-kicker">QUANTUM INTERACTION</span><h2>ELECTRON TRANSITION LAB</h2></div>
        <button className="transition-close" onClick={() => setOpen(false)}>×</button>
      </div>

      <div className="transition-stage">
        {LEVELS.map(level => <div key={level} className={`energy-level level-${level}`}><span>n={level}</span><i /></div>)}
        <div className="transition-electron" key={`${from}-${to}`} style={{ "--from": `${(from - 1) * 20}%`, "--to": `${(to - 1) * 20}%` }} />
      </div>

      <div className="transition-controls">
        <label>INITIAL LEVEL<select value={from} onChange={event => { const value = Number(event.target.value); setFrom(value); if (value === to) setTo(value === 5 ? 4 : value + 1); }}>
          {LEVELS.map(level => <option key={level} value={level}>n = {level}</option>)}
        </select></label>
        <span className="transition-arrow">→</span>
        <label>FINAL LEVEL<select value={to} onChange={event => setTarget(Number(event.target.value))}>
          {LEVELS.map(level => <option key={level} value={level}>n = {level}</option>)}
        </select></label>
      </div>

      {transition ? <div className={`transition-result ${transition.absorption ? "absorption" : "emission"}`}>
        <div className="transition-result-title">{transition.absorption ? "ENERGY ABSORBED" : "PHOTON EMITTED"}</div>
        <div className="transition-metrics"><div><span>ΔE</span><strong>{transition.delta.toFixed(2)} eV</strong></div><div><span>WAVELENGTH</span><strong>{transition.wavelength.toFixed(1)} nm</strong></div></div>
        <p>{transition.absorption ? "The electron gains energy and moves to a higher energy level." : "The electron releases energy as a photon while dropping to a lower level."}</p>
      </div> : <div className="transition-result neutral">Choose two different energy levels to begin.</div>}

      <div className="transition-footer"><span>HYDROGEN-LIKE MODEL</span><span>ENERGY LEVELS · PHOTON EVENTS</span></div>
    </section>}
  </>;
}
