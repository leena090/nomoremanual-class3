"use client";

import type { ActiveView, Mode, SessionMeta } from "../types";

/* ── 아바타 글자 추출: 2글자 이름이면 첫 글자, 3글자면 두번째 ── */
function avatarChar(name: string): string {
  return name.length === 2 ? name.charAt(0) : name.charAt(1) || name.charAt(0);
}

interface TopbarProps {
  mode: Mode;
  setMode: (m: Mode) => void;
  active: ActiveView;
  setActive: (v: ActiveView) => void;
  sessions: SessionMeta[];
  studentName: string;
  onPickStudent: () => void;
  onRequestAdmin: () => void;
}

export function Topbar({
  mode,
  setMode,
  active,
  setActive,
  sessions,
  studentName,
  onPickStudent,
  onRequestAdmin,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="brand" href="#" onClick={(e) => e.preventDefault()}>
          <div className="mark">솔</div>
          <div>
            <div className="brand__title">솔바드 3기 수업관리</div>
            <div className="brand__sub">NoMoreManual · Class 3</div>
          </div>
        </a>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {mode === "student" && studentName && (
            <button
              className="student-chip"
              onClick={onPickStudent}
              title="이름 변경"
            >
              <span className="student-chip__avatar">
                {avatarChar(studentName)}
              </span>
              <span>{studentName}</span>
            </button>
          )}
          <div className="mode-switch">
            <button
              className={
                mode === "admin" ? "is-active mode-admin" : ""
              }
              onClick={() => {
                /* 강사 모드 진입 시 비밀번호 요구 */
                if (mode !== "admin") onRequestAdmin();
                else setMode("admin");
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 1l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>
              </svg>
              관리자
            </button>
            <button
              className={mode === "student" ? "is-active" : ""}
              onClick={() => setMode("student")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              수강생
            </button>
          </div>
        </div>
      </div>
      <Tabs active={active} setActive={setActive} sessions={sessions} />
    </header>
  );
}

function Tabs({
  active,
  setActive,
  sessions,
}: {
  active: ActiveView;
  setActive: (v: ActiveView) => void;
  sessions: SessionMeta[];
}) {
  const items: Array<{ id: ActiveView; label: string; num: string }> = [
    { id: "dashboard", label: "대시보드", num: "00" },
    ...sessions.map((s) => ({
      id: `s${s.id}` as ActiveView,
      label: s.title,
      num: s.num,
    })),
    { id: "students", label: "수강생", num: "+" },
  ];
  return (
    <nav className="tabs">
      {items.map((it) => (
        <button
          key={it.id}
          className={`tab ${active === it.id ? "is-active" : ""}`}
          onClick={() => setActive(it.id)}
        >
          <span className="num">{it.num}</span>
          {it.label}
        </button>
      ))}
    </nav>
  );
}

export function SideNav({
  active,
  setActive,
  sessions,
}: {
  active: ActiveView;
  setActive: (v: ActiveView) => void;
  sessions: SessionMeta[];
}) {
  const items: Array<{ id: ActiveView; label: string; num: string }> = [
    { id: "dashboard", label: "대시보드", num: "00" },
    ...sessions.map((s) => ({
      id: `s${s.id}` as ActiveView,
      label: s.title,
      num: s.num,
    })),
    { id: "students", label: "수강생 전체", num: "+" },
  ];
  return (
    <aside className="side-nav">
      {items.map((it) => (
        <button
          key={it.id}
          className={`side-nav__item ${active === it.id ? "is-active" : ""}`}
          onClick={() => setActive(it.id)}
        >
          <span className="num">{it.num}</span>
          <span>{it.label}</span>
        </button>
      ))}
    </aside>
  );
}

export { avatarChar };
