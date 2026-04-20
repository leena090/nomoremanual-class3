"use client";

import { useEffect, useState } from "react";
import { STUDENTS, kindEmoji, kindLabel } from "../data";

/* ── 학생용 동기부여 문구 (순환) ── */
const MOTIVATION_QUOTES: string[] = [
  "오늘도 클로드랑 한 걸음. 꾸준함이 제일 큰 재능이에요 🌿",
  "모르는 건 부끄러운 게 아니라, 새로 배울 기회예요. AI한테는 더더욱 🙂",
  "30분이어도, 3분이어도 괜찮아요. 본인 속도가 맞는 속도예요 ☕",
  "클로드는 기다려줘요. 급할 거 하나도 없어요.",
  "오늘 배운 것 중 딱 하나만 내일 써보세요. 그게 진짜 실력이에요 ✨",
  "AI 시대 주인공은 빨리 배운 사람이 아니라, 자꾸 해본 사람이에요.",
  "50대에 코딩, 60대에 앱 만들기 — 지금 이 자리가 그 증명이에요 💪",
  "실수해도 괜찮아요. AI는 혼내지 않아요 🤖",
  "완벽하게 이해 못해도 손이 먼저 기억해요. 따라 해보세요.",
  "어제보다 한 줄 더 아셨으면, 오늘은 성공한 하루예요 💛",
];
import type { ActiveView, ManageState, Mode } from "../types";
import { Pill } from "./Pill";

/* ── 대시보드 ── */
export function Dashboard({
  state,
  setActive,
  mode,
  studentName,
}: {
  state: ManageState;
  setActive: (v: ActiveView) => void;
  mode: Mode;
  studentName: string;
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

  /* ── 학생 본인의 확인 현황 (student 모드일 때만 의미 있음) ── */
  const myAckCount = studentName
    ? allPosts.filter((p) => (state.acks[p.id] || []).includes(studentName))
        .length
    : 0;
  const myUnreadCount = allPosts.length - myAckCount;

  return (
    <div>
      <div className="session-head">
        <div>
          <div className="session-head__eyebrow">
            DASHBOARD · 오늘{" "}
            {new Date().toLocaleDateString("ko-KR", {
              timeZone: "Asia/Seoul",
            })}
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
          {mode === "admin" ? (
            <AdminRightColumn
              live={live}
              setActive={setActive}
            />
          ) : (
            <StudentRightColumn
              live={live}
              upcoming={upcoming}
              studentName={studentName}
              myAckCount={myAckCount}
              myUnreadCount={myUnreadCount}
              totalPosts={allPosts.length}
              setActive={setActive}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 관리자용 오른쪽 컬럼: 바로 할 일 + 진행 원칙 ── */
function AdminRightColumn({
  live,
  setActive,
}: {
  live?: ManageState["sessions"][number];
  setActive: (v: ActiveView) => void;
}) {
  return (
    <>
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
            <span className="pill pill--warn" style={{ height: "fit-content" }}>
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

      <div className="panel" style={{ marginTop: "var(--density-gap)" }}>
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
    </>
  );
}

/* ── 학생용 오른쪽 컬럼: 오늘 수업 안내 + 내 확인 현황 ── */
function StudentRightColumn({
  live,
  upcoming,
  studentName,
  myAckCount,
  myUnreadCount,
  totalPosts,
  setActive,
}: {
  live?: ManageState["sessions"][number];
  upcoming?: ManageState["sessions"][number];
  studentName: string;
  myAckCount: number;
  myUnreadCount: number;
  totalPosts: number;
  setActive: (v: ActiveView) => void;
}) {
  const nextClass = live || upcoming;
  return (
    <>
      <div className="panel panel--dark">
        <div className="panel__head">
          <div>
            <div className="eyebrow" style={{ color: "#9A9184" }}>
              {live ? "TODAY · 오늘의 수업" : "NEXT · 다음 수업"}
            </div>
            <h3 style={{ color: "#fff" }}>
              {studentName ? `${studentName}님, 반가워요` : "환영합니다"}
            </h3>
          </div>
        </div>
        {nextClass ? (
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: 14,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 10,
            }}
          >
            <span
              className={`pill pill--${live ? "accent" : "neutral"}`}
              style={{ height: "fit-content" }}
            >
              {live ? "LIVE" : nextClass.dateLabel.split(" ")[0]}
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
                {nextClass.num}강 &quot;{nextClass.title}&quot;
              </div>
              <div style={{ fontSize: 12, color: "#9A9184" }}>
                {live
                  ? `오늘 ${nextClass.dateLabel} 21:30 · Zoom`
                  : `${nextClass.dateLabel} 21:30 · Zoom`}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: 14,
              color: "#9A9184",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            모든 수업이 마무리되었어요 🎉
          </div>
        )}
        {nextClass && (
          <button
            className="btn btn--primary"
            style={{ marginTop: 14, width: "100%" }}
            onClick={() => setActive(`s${nextClass.id}` as ActiveView)}
          >
            {live ? "오늘 수업으로 이동" : "안내글 보러가기"} →
          </button>
        )}
      </div>

      <div className="panel" style={{ marginTop: "var(--density-gap)" }}>
        <div className="panel__head">
          <div>
            <div className="eyebrow">MY PROGRESS · 내 확인 현황</div>
            <h3>읽을 거리 {myUnreadCount}개</h3>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              flex: 1,
              background: "var(--color-surface-2)",
              height: 10,
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: totalPosts
                  ? `${Math.round((myAckCount / totalPosts) * 100)}%`
                  : "0%",
                height: "100%",
                background: "var(--accent)",
                transition: "width 400ms var(--ease-out)",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              color: "var(--color-dark)",
              fontWeight: 700,
            }}
          >
            {myAckCount}/{totalPosts}
          </div>
        </div>
      </div>

      <div className="panel panel--surface" style={{ marginTop: "var(--density-gap)" }}>
        <div className="panel__head">
          <div>
            <div className="eyebrow">TODAY&apos;S WORD · 오늘의 응원</div>
            <h3>💛 한마디</h3>
          </div>
        </div>
        <QuoteRotator />
      </div>
    </>
  );
}

/* ── 동기부여 문구 순환 (8초마다 전환, fade) ── */
function QuoteRotator() {
  const [idx, setIdx] = useState(() =>
    Math.floor(Math.random() * MOTIVATION_QUOTES.length)
  );
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setFade(false);
      /* fade-out 후 문구 교체 → fade-in */
      setTimeout(() => {
        setIdx((i) => (i + 1) % MOTIVATION_QUOTES.length);
        setFade(true);
      }, 300);
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div
      className="quote-box"
      onClick={() => {
        /* 클릭하면 다음 문구로 수동 전환 */
        setFade(false);
        setTimeout(() => {
          setIdx((i) => (i + 1) % MOTIVATION_QUOTES.length);
          setFade(true);
        }, 200);
      }}
      title="클릭하면 다음 한마디"
      style={{
        opacity: fade ? 1 : 0,
        transition: "opacity 300ms var(--ease-out)",
      }}
    >
      <div className="quote-box__text">{MOTIVATION_QUOTES[idx]}</div>
      <div className="quote-box__hint">
        {idx + 1} / {MOTIVATION_QUOTES.length} · 클릭하면 다음
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
