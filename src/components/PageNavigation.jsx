import { useEffect, useState } from "react";
import "./PageNavigation.css";

export default function PageNavigation() {
  const [page, setPage] = useState(1);

  useEffect(() => {
    const updatePage = () => {
      const atomPage = Boolean(
        document.querySelector(".atom-panel")
      );

      setPage(atomPage ? 2 : 1);
    };

    updatePage();

    const observer = new MutationObserver(updatePage);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const goNext = () => {
    if (page !== 1) return;
    document.querySelector(".primary-action")?.click();
  };

  const goPrevious = () => {
    if (page !== 2) return;
    document.querySelector(".back-button")?.click();
  };

  return (
    <nav className="page-navigation" aria-label="Page navigation">
      <button
        className={page === 1 ? "disabled" : ""}
        onClick={goPrevious}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <span>←</span>
        <strong>PREV</strong>
      </button>

      <div className="page-progress">
        <div className="page-progress-label">
          <span>ATOMIC EXPLORER</span>
          <b>{page} / 2</b>
        </div>

        <div className="page-progress-track">
          <div
            className="page-progress-fill"
            style={{ width: `${page * 50}%` }}
          />
        </div>

        <div className="page-progress-names">
          <span className={page === 1 ? "active" : ""}>
            ELEMENT
          </span>
          <span className={page === 2 ? "active" : ""}>
            ATOM
          </span>
        </div>
      </div>

      <button
        className={page === 2 ? "disabled" : ""}
        onClick={goNext}
        disabled={page === 2}
        aria-label="Next page"
      >
        <strong>NEXT</strong>
        <span>→</span>
      </button>
    </nav>
  );
}
