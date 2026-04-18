"use client";

import type { Accent, Density, Layout } from "../types";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  layout: Layout;
  setLayout: (v: Layout) => void;
  accent: Accent;
  setAccent: (v: Accent) => void;
  density: Density;
  setDensity: (v: Density) => void;
}

export function TweaksPanel({
  open,
  setOpen,
  layout,
  setLayout,
  accent,
  setAccent,
  density,
  setDensity,
}: Props) {
  return (
    <>
      <button
        className="tweaks-fab"
        onClick={() => setOpen(!open)}
        aria-label="Tweaks"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
      <div className={`tweaks-panel ${open ? "is-open" : ""}`}>
        <h4>Tweaks</h4>
        <div className="sub">디자인 변형</div>

        <div className="tweaks-group">
          <div className="tweaks-group__label">레이아웃</div>
          <div className="tweaks-options">
            {(["top", "side", "stacked"] as Layout[]).map((v) => (
              <button
                key={v}
                className={layout === v ? "is-active" : ""}
                onClick={() => setLayout(v)}
              >
                {v === "top" ? "Top" : v === "side" ? "Side" : "Stacked"}
              </button>
            ))}
          </div>
        </div>

        <div className="tweaks-group">
          <div className="tweaks-group__label">강조 색</div>
          <div className="tweaks-swatches">
            <button
              className={`orange ${accent === "orange" ? "is-active" : ""}`}
              onClick={() => setAccent("orange")}
            >
              ORANGE
            </button>
            <button
              className={`amber ${accent === "amber" ? "is-active" : ""}`}
              onClick={() => setAccent("amber")}
            >
              AMBER
            </button>
            <button
              className={`walnut ${accent === "walnut" ? "is-active" : ""}`}
              onClick={() => setAccent("walnut")}
            >
              WALNUT
            </button>
          </div>
        </div>

        <div className="tweaks-group" style={{ marginBottom: 0 }}>
          <div className="tweaks-group__label">밀도</div>
          <div className="tweaks-options">
            {(["cozy", "comfortable", "compact"] as Density[]).map((v) => (
              <button
                key={v}
                className={density === v ? "is-active" : ""}
                onClick={() => setDensity(v)}
              >
                {v === "cozy" ? "Cozy" : v === "comfortable" ? "Comf." : "Compact"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function Toast({ msg, show }: { msg: string; show: boolean }) {
  return (
    <div className={`toast ${show ? "is-show" : ""}`}>
      <div className="icon">✓</div>
      {msg}
    </div>
  );
}
