"use client";

import { kindEmoji, kindLabel, kindVariant, STUDENTS } from "../data";
import type { Mode, Post } from "../types";
import { avatarChar } from "./Topbar";
import { Pill } from "./Pill";

interface PostCardProps {
  post: Post;
  ackedStudents: string[];
  mode: Mode;
  studentName: string;
  onToggleAck: (name: string) => void;
  onPickStudent: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function PostCard({
  post: p,
  ackedStudents,
  mode,
  studentName,
  onToggleAck,
  onPickStudent,
  onEdit,
  onDelete,
}: PostCardProps) {
  const hasAcked = !!studentName && ackedStudents.includes(studentName);
  const ackCount = ackedStudents.length;
  const total = STUDENTS.length;
  const pct = Math.round((ackCount / total) * 100);

  return (
    <article className={`post post--${p.kind}`}>
      <div className="post__head">
        <div className="post__kind">
          <span className="post__kind-icon">{kindEmoji(p.kind)}</span>
          <Pill variant={kindVariant(p.kind)}>{kindLabel(p.kind)}</Pill>
          <span className="post__time">{p.posted_at}</span>
        </div>
        {mode === "admin" && (
          <div style={{ display: "flex", gap: 4 }}>
            <button
              className="btn btn--ghost btn--sm"
              onClick={onEdit}
              title="편집"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
              </svg>
            </button>
            <button
              className="btn btn--ghost btn--sm"
              onClick={onDelete}
              title="삭제"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14H7L5 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <h3 className="post__title">{p.title}</h3>
      <div className="post__body">{p.body}</div>

      <div className="post__ack">
        <div className="post__ack-head">
          <div>
            <div className="post__ack-label">
              {ackCount === 0
                ? "아직 아무도 확인 전이에요"
                : `${ackCount}명이 확인했어요`}
            </div>
            <div className="post__ack-sub">
              편하실 때 한 번 눌러주시면 제가 안심이 됩니다 🙂
            </div>
          </div>
          <div className="post__ack-pct">
            <div className="post__ack-bar">
              <div style={{ width: `${pct}%` }}></div>
            </div>
            <span>{pct}%</span>
          </div>
        </div>

        <AckRow
          ackedStudents={ackedStudents}
          mode={mode}
          studentName={studentName}
          hasAcked={hasAcked}
          onToggleAck={onToggleAck}
          onPickStudent={onPickStudent}
        />
      </div>
    </article>
  );
}

function AckRow({
  ackedStudents,
  mode,
  studentName,
  hasAcked,
  onToggleAck,
  onPickStudent,
}: {
  ackedStudents: string[];
  mode: Mode;
  studentName: string;
  hasAcked: boolean;
  onToggleAck: (name: string) => void;
  onPickStudent: () => void;
}) {
  const maxVisible = 10;
  const shown = ackedStudents.slice(0, maxVisible);
  const extra = Math.max(0, ackedStudents.length - maxVisible);

  return (
    <div className="post__ack-row">
      {shown.length > 0 && (
        <div className="ack-avatars">
          {shown.map((name) => (
            <span
              key={name}
              className={`ack-avatar ${name === studentName ? "is-me" : ""}`}
              title={name}
            >
              {avatarChar(name)}
            </span>
          ))}
          {extra > 0 && (
            <span className="ack-avatar ack-avatar--more">+{extra}</span>
          )}
        </div>
      )}

      {mode === "student" ? (
        !studentName ? (
          <button className="btn btn--primary ack-btn" onClick={onPickStudent}>
            내 이름 선택하고 확인하기
          </button>
        ) : hasAcked ? (
          <button
            className="btn btn--secondary ack-btn ack-btn--done"
            onClick={() => onToggleAck(studentName)}
          >
            <span className="ack-btn__check">✓</span>
            {studentName}님, 확인 완료
          </button>
        ) : (
          <button
            className="btn btn--primary ack-btn"
            onClick={() => onToggleAck(studentName)}
          >
            확인했어요
          </button>
        )
      ) : (
        <div className="ack-admin-hint">
          학생 모드에서 각자 &quot;확인했어요&quot; 버튼을 눌러요
        </div>
      )}
    </div>
  );
}
