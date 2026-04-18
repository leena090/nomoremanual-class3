"use client";

import { useState } from "react";
import { kindLabel } from "../data";
import type { Lesson, ManageState, Mode, SessionStatus } from "../types";
import { PostCard } from "./PostCard";
import { PostEditor, type EditingPost } from "./PostEditor";
import { Pill } from "./Pill";
import { SessionMetaEditor } from "./SessionMetaEditor";

interface Actions {
  addPost: (
    sessionId: number,
    data: { kind: EditingPost["kind"]; title: string; body: string }
  ) => Promise<void> | void;
  updatePost: (
    sessionId: number,
    postId: string,
    data: { kind: EditingPost["kind"]; title: string; body: string }
  ) => Promise<void> | void;
  deletePost: (sessionId: number, postId: string) => Promise<void> | void;
  toggleAck: (postId: string, name: string) => Promise<void> | void;
  setSessionStatus: (
    sessionId: number,
    status: SessionStatus
  ) => Promise<void> | void;
  updateSessionMeta: (
    sessionId: number,
    data: { title: string; subtitle: string; lessons: Lesson[] }
  ) => Promise<void> | void;
}

interface Props {
  sessionId: number;
  mode: Mode;
  state: ManageState;
  actions: Actions;
  showToast: (msg: string) => void;
  studentName: string;
  onPickStudent: () => void;
}

export function SessionPage({
  sessionId,
  mode,
  state,
  actions,
  showToast,
  studentName,
  onPickStudent,
}: Props) {
  const session = state.sessions.find((s) => s.id === sessionId);
  const [editingPost, setEditingPost] = useState<EditingPost | null>(null);
  const [editingMeta, setEditingMeta] = useState(false);

  if (!session) return null;

  const posts = state.posts[sessionId] || [];
  const acks = state.acks;
  const status: SessionStatus = state.statuses[sessionId] || "upcoming";

  const statusBadge =
    mode === "admin" ? (
      <StatusToggle
        current={status}
        onChange={(next) => actions.setSessionStatus(sessionId, next)}
      />
    ) : status === "live" ? (
      <Pill variant="accent" dot>
        진행중
      </Pill>
    ) : status === "past" ? (
      <Pill variant="success" dot>
        완료
      </Pill>
    ) : (
      <Pill variant="neutral" dot>
        예정
      </Pill>
    );

  return (
    <div>
      <div className="session-head">
        <div>
          <div className="session-head__eyebrow">
            SESSION {session.num} · {session.dateLabel} · 120분
          </div>
          <h1 className="session-head__title">{session.title}</h1>
          <div className="session-head__sub">{session.subtitle}</div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {statusBadge}
            <Pill variant="mono">{session.lessons.length}개 레슨</Pill>
            <Pill variant="neutral">게시글 {posts.length}개</Pill>
          </div>
        </div>
        {mode === "admin" && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              className="btn btn--secondary"
              onClick={() =>
                setEditingPost({ kind: "recap", title: "", body: "", isNew: true })
              }
            >
              + 수업내용
            </button>
            <button
              className="btn btn--secondary"
              onClick={() =>
                setEditingPost({
                  kind: "assignment",
                  title: "",
                  body: "",
                  isNew: true,
                })
              }
            >
              + 과제
            </button>
            <button
              className="btn btn--primary"
              onClick={() =>
                setEditingPost({ kind: "notice", title: "", body: "", isNew: true })
              }
            >
              + 공지
            </button>
          </div>
        )}
      </div>

      {/* 커리큘럼 미리보기 */}
      <div
        className="panel panel--surface"
        style={{ marginBottom: "var(--density-gap)" }}
      >
        <div className="panel__head">
          <div>
            <div className="eyebrow">CURRICULUM · 수업 구성</div>
            <h3>이 회차에서 다루는 내용</h3>
          </div>
          {mode === "admin" && (
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => setEditingMeta(true)}
            >
              ✎ 수업 구성 수정
            </button>
          )}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {session.lessons.map((l) => (
            <div
              key={l.n}
              style={{
                display: "flex",
                gap: 12,
                padding: "12px 14px",
                background: "var(--color-bg)",
                borderRadius: 12,
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--accent)",
                  fontWeight: 700,
                  paddingTop: 2,
                }}
              >
                {String(l.n).padStart(2, "0")}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    color: "var(--color-dark)",
                    fontWeight: 600,
                    lineHeight: 1.4,
                  }}
                >
                  {l.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--color-text-muted)",
                    marginTop: 2,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {l.mins}분
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 게시글 피드 */}
      {posts.length === 0 ? (
        <EmptyState
          mode={mode}
          onAdd={() =>
            setEditingPost({ kind: "notice", title: "", body: "", isNew: true })
          }
        />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--density-gap)",
          }}
        >
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              ackedStudents={acks[p.id] || []}
              mode={mode}
              studentName={studentName}
              onToggleAck={(name) => actions.toggleAck(p.id, name)}
              onPickStudent={onPickStudent}
              onEdit={() =>
                setEditingPost({
                  id: p.id,
                  kind: p.kind,
                  title: p.title,
                  body: p.body,
                  sessionId,
                  isNew: false,
                })
              }
              onDelete={async () => {
                if (confirm(`"${p.title}" 게시글을 삭제할까요?`)) {
                  await actions.deletePost(sessionId, p.id);
                  showToast("삭제되었습니다");
                }
              }}
            />
          ))}
        </div>
      )}

      {editingMeta && (
        <SessionMetaEditor
          session={session}
          onClose={() => setEditingMeta(false)}
          onSave={async (data) => {
            await actions.updateSessionMeta(sessionId, data);
            setEditingMeta(false);
          }}
        />
      )}

      {editingPost && (
        <PostEditor
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={async (data) => {
            if (editingPost.isNew) {
              await actions.addPost(sessionId, data);
              showToast(kindLabel(data.kind) + " 등록 완료");
            } else if (editingPost.id) {
              await actions.updatePost(sessionId, editingPost.id, data);
              showToast("수정되었습니다");
            }
            setEditingPost(null);
          }}
        />
      )}
    </div>
  );
}

/* ── 강사 전용: 상태 토글 (past/live/upcoming 세그먼트) ── */
function StatusToggle({
  current,
  onChange,
}: {
  current: SessionStatus;
  onChange: (next: SessionStatus) => void;
}) {
  const options: Array<{ v: SessionStatus; label: string }> = [
    { v: "past", label: "완료" },
    { v: "live", label: "진행중" },
    { v: "upcoming", label: "예정" },
  ];
  return (
    <div className="status-toggle" role="radiogroup" aria-label="회차 상태">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={current === o.v}
          className={`status-toggle__btn status-toggle__btn--${o.v} ${
            current === o.v ? "is-active" : ""
          }`}
          onClick={() => {
            if (current !== o.v) onChange(o.v);
          }}
        >
          {current === o.v && <span className="status-toggle__dot" />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

function EmptyState({
  mode,
  onAdd,
}: {
  mode: Mode;
  onAdd: () => void;
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">✍︎</div>
      <h3>아직 올라온 글이 없어요</h3>
      <p>
        {mode === "admin"
          ? "수업 후 배운 내용, 과제, 공지를 편하게 올려주세요."
          : "강사님이 곧 수업 내용과 과제를 올려주실 거예요."}
      </p>
      {mode === "admin" && (
        <button className="btn btn--primary" onClick={onAdd}>
          첫 공지 올리기
        </button>
      )}
    </div>
  );
}
