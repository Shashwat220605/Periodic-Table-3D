import { useEffect, useState } from "react";
import "./ElementNavigationOverlay.css";

export default function ElementNavigationOverlay() {
  const [visible, setVisible] = useState(false);
  const [number, setNumber] = useState("001");

  useEffect(() => {
    const sync = () => {
      const panel = document.querySelector(".atom-panel");
      const counter = document.querySelector(".atom-navigation > div span");
      setVisible(Boolean(panel));
      if (counter?.textContent?.trim()) {
        setNumber(counter.textContent.trim());
      }
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  const previous = () => {
    document.querySelector(".atom-navigation button:first-child")?.click();
  };

  const next = () => {
    document.querySelector(".atom-navigation button:last-child")?.click();
  };

  if (!visible) return null;

  return (
    <nav className="element-navigation-overlay" aria-label="Element navigation">
      <button onClick={previous} className="element-overlay-button">
        <span className="element-overlay-arrow">←</span>
        <span>PREVIOUS ELEMENT</span>
      </button>

      <div className="element-overlay-center">
        <span className="element-overlay-label">ELEMENT NAVIGATION</span>
        <strong>{number}</strong>
        <small>/ 118</small>
      </div>

      <button onClick={next} className="element-overlay-button element-overlay-next">
        <span>NEXT ELEMENT</span>
        <span className="element-overlay-arrow">→</span>
      </button>
    </nav>
  );
}
