"use client";

import { useState } from "react";
import { STUDENTS, kindEmoji, kindLabel } from "../data";
import type { ActiveView, ManageState } from "../types";
import { Pill } from "./Pill";

/* ── 대시보드 ── */
export function Dashboard({
  state,
  setActive,
}: {
  state: ManageState;
  setActive: (v: ActiveView) => void;
}) {
  const totalStudents = STUDENTS.length;
  const allPosts = Object.entries(state.posts).flatMap(([sid, arr]) =>
    arr.map((p) => ({ ...p, sid: Number(sid) }))
  );
  const totalAckSlots = allPosts.length * totalStudents;
  const totalAcks = allPosts.reduce(
    (acc, p) => acc + (state.acks[p.id]?.length || 0),
    0
  );
  const ackPct = totalAckSlots
    ? Math.round((totalAcks / totalAckSlots) * 100)
    : 0;

  const upcoming = state.sessions.find(
    (s) => state.statuses[s.id] === "upcoming"
  );
  const live = state.sessions.find((s) => state.statuses[s.id] === "live");

  return (
    <div>
      <div className="session-head">
        <div>
          <div className="session-head__eyebrow">
            DASHBOARD · 오늘 {new Date().toLocaleDateString("ko-KR")}
          </div>
          <h1 className="session-head__title">솔바드 3기 수업관리</h1>
          <div className="session-head__sub">
            수강생 {totalStudents}명 · 4회차 수업 · 지금은{" "}
            {live
              ? live.num + "강 진행중"
              : upcoming
                ? upcoming.num + "강 예정"
                : "모든 수업 종료"}
          </div>
        </div>
      </div>

      <div
        className="tile-grid"
        style={{ marginBottom: "var(--density-gap)" }}
      >
        <div className="tile tile--accent">
          <span className="tile__label">전체 확인율</span>
          <span className="tile__value">{ackPct}%</span>
          <span className="tile__hint">부담 없이, 편하실 때</span>
        </div>
        <div className="tile">
          <span className="tile__label">수강생</span>
          <span className="tile__value">{totalStudents}</span>
          <span className="tile__hint">성인 학습자 · 자율 참여</span>
        </div>
        <div className="tile">
          <span className="tile__label">올린 글</span>
          <span className="tile__value">{allPosts.length}</span>
          <span className="tile__hint">수업내용 · 과제 · 공지</span>
        </div>
        <div className="tile tile--dark">
          <span className="tile__label">다음 수업</span>
          <span className="tile__value">
            {upcoming ? upcoming.dateLabel.split(" ")[0] : "—"}
          </span>
          <span className="tile__hint">
            {upcoming ? upcoming.title : "모든 수업 종료"}
          </span>
        </div>
      </div>

      <div className="content-grid">
        <div className="panel">
          <div className="panel__head">
            <div>
              <div className="eyebrow">SCHEDULE · 전체 일정</div>
              <h3>4회차 커리큘럼</h3>
            </div>
          </div>
          <div className="timeline">
            {state.sessions.map((session) => {
              const sStatus = state.statuses[session.id] || "upcoming";
              const sessionPosts = state.posts[session.id] || [];
              const sessionAcks = sessionPosts.reduce(
                (acc, p) => acc + (state.acks[p.id]?.length || 0),
                0
              );
              const sessionSlots = sessionPosts.length * totalStudents;
              const pct = sessionSlots
                ? Math.round((sessionAcks / sessionSlots) * 100)
                : 0;
              return (
                <div
                  key={session.id}
                  className="timeline__item"
                  onClick={() => setActive(`s${session.id}` as ActiveView)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="timeline__date">
                    <strong>
                      {session.month}/{session.day}
                    </strong>
                    <span>
                      {session.weekday}요일 · {session.num}강
                    </span>
                  </div>
                  <div className="timeline__body">
                    <strong>{session.title}</strong>
                    <span>
                      {session.subtitle} · 글 {sessionPosts.length}개
                      {sessionPosts.length > 0 ? ` · 확인 ${pct}%` : ""}
                    </span>
                  </div>
                  <div>
                    {sStatus === "live" && (
                      <Pill variant="accent" dot>
                        진행중
                      </Pill>
                    )}
                    {sStatus === "past" && (
                      <Pill variant="success" dot>
                        완료
                      </Pill>
                    )}
                    {sStatus === "upcoming" && (
                      <Pill variant="neutral">예정</Pill>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="panel panel--dark">
            <div className="panel__head">
              <div>
                <div className="eyebrow" style={{ color: "#9A9184" }}>
                  NEXT UP · 바로 할 일
                </div>
                <h3 style={{ color: "#fff" }}>오늘·이번 주</h3>
              </div>
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {live && (
                <li
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: 14,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 10,
                  }}
                >
                  <span
                    className="pill pill--accent"
                    style={{ height: "fit-content" }}
                  >
                    LIVE
                  </span>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading-ko)",
                        fontSize: 16,
                        color: "#fff",
                        marginBottom: 4,
                      }}
                    >
                      {live.num}강 &quot;{live.title}&quot;
                    </div>
                    <div style={{ fontSize: 12, color: "#9A9184" }}>
                      오늘 {live.dateLabel} 21:30 · Zoom
                    </div>
                  </div>
                </li>
              )}
              <li
                style={{
                  display: "flex",
                  gap: 12,
                  padding: 14,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 10,
                }}
              >
                <span
                  className="pill pill--warn"
                  style={{ height: "fit-content" }}
                >
                  할 일
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-heading-ko)",
                      fontSize: 16,
                      color: "#fff",
                      marginBottom: 4,
                    }}
                  >
                    오늘 수업 요약 올리기
                  </div>
                  <div style={{ fontSize: 12, color: "#9A9184" }}>
                    + 수업내용 · + 과제 · + 공지 버튼으로 간단히
                  </div>
                </div>
              </li>
            </ul>
            {live && (
              <button
                className="btn btn--primary"
                style={{ marginTop: 14, width: "100%" }}
                onClick={() => setActive(`s${live.id}` as ActiveView)}
              >
                진행중 수업으로 이동 →
              </button>
            )}
          </div>

          <div
            className="panel"
            style={{ marginTop: "var(--density-gap)" }}
          >
            <div className="panel__head">
              <div>
                <div className="eyebrow">TIP · 진행 원칙</div>
                <h3>강요 없이, 편하게</h3>
              </div>
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: 14,
                color: "var(--color-text)",
                lineHeight: 1.7,
              }}
            >
              <li style={{ paddingLeft: 18, position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: "var(--accent)",
                    fontWeight: 700,
                  }}
                >
                  ·
                </span>
                성인 학습자를 존중 — 확인은 자율
              </li>
              <li style={{ paddingLeft: 18, position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: "var(--accent)",
                    fontWeight: 700,
                  }}
                >
                  ·
                </span>
                제출·점수 추적 없음 — &quot;확인했어요&quot;면 충분
              </li>
              <li style={{ paddingLeft: 18, position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: "var(--accent)",
                    fontWeight: 700,
                  }}
                >
                  ·
                </span>
                녹화본 + 카톡 질문으로 결석자도 캐치업
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 수강생 페이지 (확인 매트릭스) ── */
export function StudentsPage({ state }: { state: ManageState }) {
  const [query, setQuery] = useState("");
  const filtered = STUDENTS.filter((s) => s.includes(query));

  const allPosts = Object.entries(state.posts).flatMap(([sid, arr]) =>
    arr.map((p) => ({ ...p, sid: Number(sid) }))
  );

  const studentStats = filtered.map((name) => {
    const acked = allPosts.filter((p) =>
      (state.acks[p.id] || []).includes(name)
    );
    return { name, ackCount: acked.length, totalPosts: allPosts.length };
  });

  return (
    <div>
      <div className="session-head">
        <div>
          <div className="session-head__eyebrow">STUDENTS · 수강생 전체</div>
          <h1 className="session-head__title">수강생 {STUDENTS.length}명</h1>
          <div className="session-head__sub">
            누가 어떤 글을 확인했는지 가볍게 살필 수 있어요. 압박용이 아니라 안부 체크용이에요.
          </div>
        </div>
        <input
          className="nmm-input"
          style={{ maxWidth: 240 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 이름 검색"
        />
      </div>

      <div className="panel">
        <div className="panel__head">
          <div>
            <div className="eyebrow">ACK MATRIX · 확인 현황</div>
            <h3>수강생 × 게시글</h3>
          </div>
        </div>

        {allPosts.length === 0 ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "var(--color-text-subtle)",
            }}
          >
            아직 올라온 글이 없어요.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="ack-table">
              <thead>
                <tr>
                  <th className="ack-table__sticky">수강생</th>
                  <th>확인수</th>
                  {allPosts.map((p) => (
                    <th key={p.id} className="ack-table__col">
                      <div className="ack-table__col-sid">{p.sid}강</div>
                      <div className="ack-table__col-kind">
                        {kindEmoji(p.kind)} {kindLabel(p.kind)}
                      </div>
                      <div className="ack-table__col-title">{p.title}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {studentStats.map((st, idx) => (
                  <tr key={st.name}>
                    <td
                      className="ack-table__sticky"
                      style={{
                        background:
                          idx % 2 ? "var(--color-surface)" : "var(--color-bg)",
                      }}
                    >
                      {st.name}
                    </td>
                    <td
                      style={{
                        fontFamily: "var(--font-mono)",
                        color: "var(--color-text-muted)",
                        background:
                          idx % 2 ? "var(--color-surface)" : "transparent",
                      }}
                    >
                      {st.ackCount}/{st.totalPosts}
                    </td>
                    {allPosts.map((p) => {
                      const acked = (state.acks[p.id] || []).includes(st.name);
                      return (
                        <td
                          key={p.id}
                          className={`ack-table__cell ${acked ? "is-acked" : ""}`}
                          style={{
                            background:
                              idx % 2 && !acked
                                ? "var(--color-surface)"
                                : undefined,
                          }}
                        >
                          {acked ? "✓" : "·"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div
          style={{
            marginTop: 14,
            fontSize: 12,
            color: "var(--color-text-muted)",
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span>
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                background: "var(--accent-soft)",
                color: "var(--accent)",
                borderRadius: 3,
                marginRight: 6,
                textAlign: "center",
                lineHeight: "12px",
                fontSize: 9,
                fontWeight: 700,
                verticalAlign: "middle",
              }}
            >
              ✓
            </span>
            확인함
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                border: "1px solid var(--color-border)",
                borderRadius: 3,
                marginRight: 6,
                verticalAlign: "middle",
              }}
            ></span>
            아직 안 봤거나 미확인
          </span>
          <span style={{ marginLeft: "auto", color: "var(--color-text-subtle)" }}>
            ※ 강제하지 않는 참고 지표
          </span>
        </div>
      </div>
    </div>
  );
}
