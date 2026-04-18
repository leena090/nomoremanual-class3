"use client";

import { useState } from "react";
import { kindEmoji, kindLabel } from "../data";
import type { PostKind } from "../types";

export interface EditingPost {
  id?: string;
  kind: PostKind;
  title: string;
  body: string;
  sessionId?: number;
  isNew: boolean;
}

interface Props {
  post: EditingPost;
  onClose: () => void;
  onSave: (data: { kind: PostKind; title: string; body: string }) => void;
}

const TEMPLATES: Record<PostKind, { title: string; body: string }> = {
  recap: {
    title: "수업 요약 — ",
    body: "오늘 함께한 내용 간단히 정리해둘게요.\n\n· \n· \n· \n\n녹화본은 카톡 공지방에 올려둘게요. 편하실 때 다시 보세요.",
  },
  assignment: {
    title: "과제 — ",
    body: "거창하지 않아도 괜찮습니다.\n\n이번 주에는 \n\n마감: 다음 수업 전까지\n어려우신 분은 카톡으로 편하게 질문 주세요.",
  },
  notice: { title: "", body: "" },
};

export function PostEditor({ post, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    kind: post.kind,
    title: post.title,
    body: post.body,
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{post.isNew ? "새 글 올리기" : "글 수정"}</h3>
        <div className="form-grid">
          <div>
            <label>종류</label>
            <div className="seg-group">
              {(["recap", "assignment", "notice"] as PostKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  className={form.kind === k ? "is-active" : ""}
                  onClick={() => setForm({ ...form, kind: k })}
                >
                  {kindEmoji(k)} {kindLabel(k)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label>제목</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="한 줄로 요약해주세요"
            />
          </div>
          <div>
            <label>본문</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="내용을 편하게 적어주세요. 줄바꿈도 그대로 유지됩니다."
              style={{ minHeight: 180 }}
            />
            {post.isNew && (
              <button
                type="button"
                className="chip-btn"
                style={{ marginTop: 8 }}
                onClick={() =>
                  setForm({
                    ...form,
                    title: TEMPLATES[form.kind].title,
                    body: TEMPLATES[form.kind].body,
                  })
                }
              >
                ✨ {kindLabel(form.kind)} 템플릿 불러오기
              </button>
            )}
          </div>
        </div>
        <div className="modal__foot">
          <button className="btn btn--ghost" onClick={onClose}>
            취소
          </button>
          <button
            className="btn btn--primary"
            disabled={!form.title.trim() || !form.body.trim()}
            onClick={() => onSave(form)}
          >
            {post.isNew ? "올리기" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
