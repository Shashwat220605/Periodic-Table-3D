import { useMemo, useState } from "react";
import elements from "../../data/elements";
import { getTrendColorIntensity, getTrendValue, trendDefinitions } from "../../data/periodicTrends";
import "./TrendsExplorer.css";

const keys = Object.keys(trendDefinitions);

export default function TrendsExplorer({ onSelectElement, onClose }) {
  const [trendKey, setTrendKey] = useState("electronegativity");
  const [hovered, setHovered] = useState(null);

  const values = useMemo(
    () => elements.map((element) => getTrendValue(element, trendKey)).filter((value) => value != null),
    [trendKey]
  );

  const min = Math.min(...values);
  const max = Math.max(...values);
  const trend = trendDefinitions[trendKey];

  const groups = useMemo(() => {
    const map = new Map();
    elements.forEach((element) => {
      const period = element.period ?? 1;
      if (!map.has(period)) map.set(period, []);
      map.get(period).push(element);
    });
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, []);

  return (
    <section className="trends-page">
      <div className="trends-header">
        <button className="trends-back" onClick={onClose}>← BACK</button>
        <div>
          <div className="trends-kicker">PERIODIC TRENDS</div>
          <h1>Properties across the periodic table</h1>
          <p>{trend.description}</p>
        </div>
        <div className="trend-selector-wrap">
          <label>PROPERTY</label>
          <select value={trendKey} onChange={(e) => setTrendKey(e.target.value)}>
            {keys.map((key) => <option key={key} value={key}>{trendDefinitions[key].label}</option>)}
          </select>
        </div>
      </div>

      <div className="trend-card">
        <div className="trend-card-top">
          <div>
            <span className="trend-property-label">CURRENT PROPERTY</span>
            <strong>{trend.label}</strong>
          </div>
          <div className="trend-scale">
            <span>LOW</span>
            <div className="scale-bar" />
            <span>HIGH</span>
          </div>
        </div>

        <div className="trend-table">
          {groups.map(([period, row]) => (
            <div className="trend-row" key={period}>
              <span className="period-number">{period}</span>
              <div className="trend-elements">
                {row.map((element) => {
                  const value = getTrendValue(element, trendKey);
                  const intensity = getTrendColorIntensity(value, min, max);
                  const active = hovered?.number === element.number;
                  return (
                    <button
                      className={`trend-element ${active ? "active" : ""}`}
                      key={element.number}
                      style={{ opacity: value == null ? 0.22 : 0.28 + intensity * 0.72 }}
                      onMouseEnter={() => setHovered(element)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => onSelectElement?.(element)}
                    >
                      <span className="trend-symbol">{element.symbol}</span>
                      <span className="trend-number">{element.number}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="trend-direction">
          <span>GENERALLY INCREASES</span>
          <div className="direction-arrow">↗</div>
          <span>TOWARD THIS REGION</span>
        </div>
      </div>

      {hovered && (
        <div className="trend-inspector">
          <div className="trend-inspector-symbol">{hovered.symbol}</div>
          <div>
            <span>{hovered.name}</span>
            <strong>{getTrendValue(hovered, trendKey) == null ? "Data unavailable" : trend.format(getTrendValue(hovered, trendKey))}</strong>
          </div>
          <button onClick={() => onSelectElement?.(hovered)}>EXPLORE ATOM →</button>
        </div>
      )}
    </section>
  );
}
