import { useEffect, useMemo, useState } from "react";
import { getElectronConfiguration, getShellConfiguration } from "../../data/electronConfiguration";
import "./ElementDossier.css";

const categoryLabels = {
  "alkali-metal": "Alkali Metal",
  "alkaline-earth": "Alkaline Earth Metal",
  "transition-metal": "Transition Metal",
  "post-transition-metal": "Post-transition Metal",
  metalloid: "Metalloid",
  nonmetal: "Nonmetal",
  halogen: "Halogen",
  "noble-gas": "Noble Gas",
  lanthanide: "Lanthanide",
  actinide: "Actinide",
};

const stateLabels = {
  solid: "Solid",
  liquid: "Liquid",
  gas: "Gas",
};

export default function ElementDossier({ element, onClose }) {
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const electronData = useMemo(() => getElectronConfiguration(element.number), [element.number]);
  const shells = useMemo(() => getShellConfiguration(element.number), [element.number]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSummary("");
    setImage("");
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(element.name)}`)
      .then(response => response.ok ? response.json() : Promise.reject(new Error("Knowledge source unavailable")))
      .then(data => {
        if (cancelled) return;
        setSummary(data.extract || "No external knowledge brief is available for this element yet.");
        setImage(data.thumbnail?.source || "");
      })
      .catch(() => {
        if (!cancelled) setSummary("The live knowledge brief could not be loaded. The atomic data shown above is available locally.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [element.name]);

  return (
    <div className="dossier-overlay" role="dialog" aria-modal="true" aria-label={`${element.name} element dossier`}>
      <section className="dossier-panel">
        <header className="dossier-header">
          <div>
            <span className="dossier-kicker">ELEMENT DOSSIER · {String(element.number).padStart(3, "0")}</span>
            <h2>{element.name}</h2>
            <p>{categoryLabels[element.category] || element.category} · Period {element.period} · Group {element.group || "—"}</p>
          </div>
          <button className="dossier-close" onClick={onClose} aria-label="Close dossier">×</button>
        </header>

        <div className="dossier-grid">
          <div className="dossier-identity">
            <div className="dossier-symbol">{element.symbol}</div>
            <div className="dossier-number">{element.number}</div>
            <div className="dossier-state"><span /> {stateLabels[element.state] || element.state}</div>
          </div>

          <div className="dossier-stats">
            <div><span>ATOMIC MASS</span><strong>{element.mass} u</strong></div>
            <div><span>PROTONS</span><strong>{element.number}</strong></div>
            <div><span>ELECTRONS</span><strong>{element.number}</strong></div>
            <div><span>NEUTRONS*</span><strong>{Math.max(0, Math.round(Number(element.mass)) - element.number)}</strong></div>
          </div>
        </div>

        <div className="dossier-sections">
          <article className="dossier-card dossier-wide">
            <div className="dossier-card-label">KNOWLEDGE BRIEF</div>
            {image && <img className="dossier-image" src={image} alt="" />}
            {loading ? <div className="dossier-loading"><span /> Loading element knowledge…</div> : <p className="dossier-summary">{summary}</p>}
          </article>

          <article className="dossier-card">
            <div className="dossier-card-label">ELECTRON CONFIGURATION</div>
            <code className="dossier-config">{electronData?.configuration || "Unavailable"}</code>
            <div className="dossier-shells">{shells.map(shell => <span key={shell.shell}>n{shell.shell}<b>{shell.electrons}</b></span>)}</div>
          </article>

          <article className="dossier-card">
            <div className="dossier-card-label">CLASSIFICATION</div>
            <div className="dossier-classification">{categoryLabels[element.category] || element.category}</div>
            <div className="dossier-mini-row"><span>PERIOD</span><b>{element.period}</b></div>
            <div className="dossier-mini-row"><span>GROUP</span><b>{element.group || "—"}</b></div>
            <div className="dossier-mini-row"><span>STATE</span><b>{stateLabels[element.state] || element.state}</b></div>
          </article>
        </div>

        <footer className="dossier-footer">* Neutron count uses the rounded atomic mass as an approximate reference. Knowledge brief powered by Wikipedia's public summary API.</footer>
      </section>
    </div>
  );
}
