import { useMemo, useState } from "react";
import elements from "../../data/elements";
import "./AtomBuilder.css";

const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

function ParticleControl({ label, symbol, value, onChange, min = 0, max = 118, tone }) {
  return (
    <div className="builder-control" data-tone={tone}>
      <div className="builder-control-head">
        <span className="builder-particle-symbol">{symbol}</span>
        <span>{label}</span>
      </div>
      <div className="builder-stepper">
        <button onClick={() => onChange(clamp(value - 1, min, max))}>−</button>
        <strong>{value}</strong>
        <button onClick={() => onChange(clamp(value + 1, min, max))}>+</button>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function nucleusStatus(protons, neutrons) {
  if (protons < 1) return { kind: "invalid", title: "No atom", text: "A nucleus needs at least one proton." };
  if (protons > 118) return { kind: "invalid", title: "Unknown element", text: "This builder currently supports the 118 known elements." };

  const z = protons;
  if (z === 43 || z === 61 || z > 82) {
    return {
      kind: "radioactive",
      title: "Radioactive nucleus",
      text: "This element has no stable isotopes. The selected nucleus can exist as a radioactive isotope.",
    };
  }

  if (neutrons === 0 && z > 1) {
    return {
      kind: "unstable",
      title: "Highly neutron-deficient",
      text: "The nucleus is structurally represented, but this neutron count is not a normal stable isotope.",
    };
  }

  return {
    kind: "valid",
    title: "Valid nuclear composition",
    text: "The proton count identifies the element. Neutrons determine the isotope.",
  };
}

export default function AtomBuilder({ onClose }) {
  const [open, setOpen] = useState(false);
  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);

  const element = useMemo(
    () => elements.find((item) => item.number === protons) || null,
    [protons]
  );

  const massNumber = protons + neutrons;
  const charge = protons - electrons;
  const status = nucleusStatus(protons, neutrons);

  const chargeLabel =
    charge === 0 ? "Neutral" : charge > 0 ? `${charge}+ ion` : `${Math.abs(charge)}− ion`;

  const setParticle = (setter, value, min, max) => {
    setter(clamp(value, min, max));
  };

  const reset = () => {
    setProtons(6);
    setNeutrons(6);
    setElectrons(6);
  };

  if (!open) {
    return (
      <button className="atom-builder-launcher" onClick={() => setOpen(true)}>
        <span className="builder-launcher-orb">⚛</span>
        <span>
          <small>LAB</small>
          ATOM BUILDER
        </span>
        <b>→</b>
      </button>
    );
  }

  return (
    <div className="atom-builder-overlay">
      <section className="atom-builder-panel">
        <header className="builder-header">
          <div>
            <div className="builder-kicker">QUANTUM LAB · ATOM CONSTRUCTOR</div>
            <h2>Build an Atom</h2>
            <p>Change the particles and watch the identity, isotope and charge update in real time.</p>
          </div>
          <button className="builder-close" onClick={() => { setOpen(false); onClose?.(); }}>×</button>
        </header>

        <div className="builder-workspace">
          <div className="builder-controls">
            <ParticleControl label="PROTONS" symbol="p⁺" value={protons} max={118} onChange={(v) => setParticle(setProtons, v, 1, 118)} tone="proton" />
            <ParticleControl label="NEUTRONS" symbol="n⁰" value={neutrons} max={220} onChange={(v) => setParticle(setNeutrons, v, 0, 220)} tone="neutron" />
            <ParticleControl label="ELECTRONS" symbol="e⁻" value={electrons} max={128} onChange={(v) => setParticle(setElectrons, v, 0, 128)} tone="electron" />

            <div className="builder-actions">
              <button onClick={reset}>RESET</button>
              <div className="builder-hint">Atomic number = proton count</div>
            </div>
          </div>

          <div className="builder-preview">
            <div className="builder-preview-top">
              <span>LIVE ATOMIC PREVIEW</span>
              <span className={`builder-status-dot ${status.kind}`} />
            </div>

            <div className="builder-atom-stage">
              <div className="builder-aura" />
              <div className="builder-orbit builder-orbit-a" />
              <div className="builder-orbit builder-orbit-b" />
              <div className="builder-orbit builder-orbit-c" />
              <div className="builder-nucleus">
                <strong>{element?.symbol || "?"}</strong>
                <span>{element?.name || "Unknown"}</span>
              </div>
              <div className="builder-electron be-a" />
              <div className="builder-electron be-b" />
              <div className="builder-electron be-c" />
              <div className="builder-electron be-d" />
            </div>

            <div className="builder-identity">
              <div className="builder-notation">
                <sup>{massNumber}</sup>
                <sub>{protons}</sub>
                <strong>{element?.symbol || "?"}</strong>
                {charge !== 0 && <em>{Math.abs(charge)}{charge > 0 ? "+" : "−"}</em>}
              </div>
              <h3>{element?.name || "Unknown element"}</h3>
              <span>{chargeLabel} · isotope {massNumber}</span>
            </div>
          </div>
        </div>

        <div className="builder-data-grid">
          <div><span>ATOMIC NUMBER</span><strong>{protons}</strong></div>
          <div><span>MASS NUMBER</span><strong>{massNumber}</strong></div>
          <div><span>NET CHARGE</span><strong>{charge > 0 ? `+${charge}` : charge}</strong></div>
          <div><span>ELEMENT</span><strong>{element?.symbol || "—"}</strong></div>
        </div>

        <div className={`builder-validation ${status.kind}`}>
          <div className="validation-icon">{status.kind === "valid" ? "✓" : status.kind === "radioactive" ? "◌" : "!"}</div>
          <div>
            <strong>{status.title}</strong>
            <p>{status.text}</p>
          </div>
        </div>

        <footer className="builder-footer">
          <span>PROTONS DEFINE ELEMENT · NEUTRONS DEFINE ISOTOPE · ELECTRONS DEFINE CHARGE</span>
          <span>118 ELEMENTS</span>
        </footer>
      </section>
    </div>
  );
}
