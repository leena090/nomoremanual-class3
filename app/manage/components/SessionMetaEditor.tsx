"use client";

import { useState } from "react";
import type { Lesson, SessionMeta } from "../types";

/* ── 회차 수업 구성 편집 모달 (강사 전용) ──
   제목/부제/레슨 목록(순서+내용+소요분) 수정
*/
export function SessionMetaEditor({
  session,
  onClose,
  onSave,
}: {
  session: SessionMeta;
  onClose: () => void;
  onSave: (data: {
    title: string;
    subtitle: string;
    lessons: Lesson[];
  }) => void;
}) {
  const [title, setTitle] = useState(session.title);
  const [subtitle, setSubtitle] = useState(session.subtitle);
  const [lessons, setLessons] = useState<Lesson[]>(
    session.lessons.map((l) => ({ ...l }))
  );

  function updateLesson(idx: number, patch: Partial<Lesson>) {
    setLessons((arr) =>
      arr.map((l, i) => (i === idx ? { ...l, ...patch } : l))
    );
  }

  function addLesson() {
    setLessons((arr) => [
      ...arr,
      { n: arr.length + 1, title: "", mins: 30 },
    ]);
  }

  function removeLesson(idx: number) {
    setLessons((arr) =>
      arr
        .filter((_, i) => i !== idx)
        .map((l, i) => ({ ...l, n: i + 1 }))
    );
  }

  function moveLesson(idx: number, delta: -1 | 1) {
    setLessons((arr) => {
      const next = idx + delta;
      if (next < 0 || next >= arr.length) return arr;
      const copy = [...arr];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy.map((l, i) => ({ ...l, n: i + 1 }));
    });
  }

  const canSave =
    !!title.trim() &&
    !!subtitle.trim() &&
    lessons.length > 0 &&
    lessons.every((l) => l.title.trim() && l.mins >= 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 620 }}
      >
        <h3>
          {session.num}강 수업 구성 수정
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "var(--color-text-muted)",
            marginBottom: 16,
          }}
        >
          제목·부제는 탭/대시보드·헤더에 모두 반영됩니다. 레슨은 커리큘럼
          패널에 보여줘요.
        </p>

        <div className="form-grid">
          <div>
            <label>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 클로드 마스터"
            />
          </div>
          <div>
            <label>부제</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="예: 이해부터 실전 활용까지"
            />
          </div>
          <div>
            <label>레슨 목록</label>
            <div className="lesson-editor">
              {lessons.map((l, idx) => (
                <div key={idx} className="lesson-editor__row">
                  <div className="lesson-editor__order">
                    <button
                      type="button"
                      onClick={() => moveLesson(idx, -1)}
                      disabled={idx === 0}
                      title="위로"
                      aria-label="위로"
                    >
                      ↑
                    </button>
                    <span className="lesson-editor__n">
                      {String(l.n).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={() => moveLesson(idx, 1)}
                      disabled={idx === lessons.length - 1}
                      title="아래로"
                      aria-label="아래로"
                    >
                      ↓
                    </button>
                  </div>
                  <input
                    type="text"
                    className="lesson-editor__title"
                    value={l.title}
                    onChange={(e) =>
                      updateLesson(idx, { title: e.target.value })
                    }
                    placeholder="레슨 제목"
                  />
                  <div className="lesson-editor__mins">
                    <input
                      type="number"
                      min={0}
                      value={l.mins}
                      onChange={(e) =>
                        updateLesson(idx, {
                          mins: Number(e.target.value) || 0,
                        })
                      }
                    />
                    <span>분</span>
                  </div>
                  <button
                    type="button"
                    className="lesson-editor__remove"
                    onClick={() => removeLesson(idx)}
                    title="삭제"
                    aria-label="삭제"
                    disabled={lessons.length === 1}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="chip-btn"
                style={{ alignSelf: "flex-start", marginTop: 4 }}
                onClick={addLesson}
              >
                + 레슨 추가
              </button>
            </div>
          </div>
        </div>
        <div className="modal__foot">
          <button className="btn btn--ghost" onClick={onClose}>
            취소
          </button>
          <button
            className="btn btn--primary"
            disabled={!canSave}
            onClick={() =>
              onSave({
                title: title.trim(),
                subtitle: subtitle.trim(),
                lessons: lessons.map((l, i) => ({
                  n: i + 1,
                  title: l.title.trim(),
                  mins: Math.max(0, Math.round(l.mins)),
                })),
              })
            }
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
