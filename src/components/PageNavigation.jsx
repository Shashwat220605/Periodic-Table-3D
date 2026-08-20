import { useEffect, useState } from "react";
import "./PageNavigation.css";

export default function PageNavigation() {
  const [page, setPage] = useState(1);
  useEffect(() => {
    const update = () => setPage(document.querySelector(".atom-panel") ? 2 : 1);
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  const goNext = () => document.querySelector(".primary-action")?.click();
  const goPrevious = () => document.querySelector(".back-button")?.click();
  return <nav className="page-navigation" aria-label="Element navigation">
    <button className="page-nav-arrow" onClick={goPrevious} aria-label="Previous element"><span>←</span><b>PREV</b></button>
    <div className="page-progress"><div className="page-progress-label"><span>ATOMIC EXPLORER</span><b>{page} / 2</b></div><div className="page-progress-track"><div className="page-progress-fill" style={{width:`${page*50}%`}}/></div><div className="page-progress-names"><span className={page===1?"active":""}>ELEMENT</span><span className={page===2?"active":""}>ATOM</span></div></div>
    <button className="page-nav-arrow" onClick={goNext} aria-label="Next element"><b>NEXT</b><span>→</span></button>
  </nav>;
}
