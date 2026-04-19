"use client";

/**
 * 전체공지 편집 모달 — 관리자 전용.
 * 제목 · 본문 · eyebrow · 하단 메모 · 노출 여부 편집 후 저장.
 * "미리보기" 버튼으로 오늘 하루 숨김 플래그 제거 + 팝업 다시 열기 가능.
 */

import { useState } from "react";
import type { Notice } from "../types";

interface Props {
  notice: Notice;
  adminKey: string;
  onClose: () => void;
  onSaved: (notice: Notice) => void;
  onPreview: () => void;
  showToast: (msg: string) => void;
}

export function NoticeEditor({
  notice,
  adminKey,
  onClose,
  onSaved,
  onPreview,
  showToast,
}: Props) {
  const [eyebrow, setEyebrow] = useState(notice.eyebrow);
  const [title, setTitle] = useState(notice.title);
  const [body, setBody] = useState(notice.body);
  const [footNote, setFootNote] = useState(notice.foot_note);
  const [enabled, setEnabled] = useState(notice.enabled);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim() || !body.trim()) {
      showToast("제목과 본문을 채워 주세요");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/manage/notice", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          enabled,
          eyebrow: eyebrow.trim(),
          title: title.trim(),
          body,
          foot_note: footNote.trim(),
        }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || "저장 실패");
        return;
      }
      onSaved(data.notice as Notice);
      showToast("공지가 저장되었습니다");
      onClose();
    } catch (e) {
      console.error(e);
      showToast("저장 중 오류");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal notice-editor"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 640 }}
      >
        <h3>📢 전체공지 편집</h3>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: 13,
            marginBottom: 18,
            marginTop: -8,
          }}
        >
          수강생이 페이지에 들어오면 첫 화면 위에 뜨는 안내 팝업이에요. 본문은 빈 줄로 단락을 나누면 됩니다.
        </p>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
            fontSize: 14,
            fontWeight: 700,
            color: "var(--color-dark)",
          }}
        >
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            style={{ width: 18, height: 18, margin: 0 }}
          />
          이 공지를 노출합니다
        </label>

        <div className="form-grid">
          <div>
            <label>상단 라벨 (eyebrow)</label>
            <input
              type="text"
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              placeholder="예: NMM · CLASS 3 · 공지"
              maxLength={60}
            />
          </div>

          <div>
            <label>제목 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 2강 수업 안내드려요"
              maxLength={80}
            />
          </div>

          <div>
            <label>본문 * (빈 줄로 단락 구분)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={`4/21 화요일 저녁 8시 2강 시작합니다.

준비물: 노트북, 클로드 코드 설치 확인.

못 오시는 분은 단톡방에 미리 남겨주세요.`}
              rows={10}
              style={{ minHeight: 200, fontFamily: "inherit", fontSize: 14 }}
            />
          </div>

          <div>
            <label>하단 메모 (선택)</label>
            <input
              type="text"
              value={footNote}
              onChange={(e) => setFootNote(e.target.value)}
              placeholder="예: · 업데이트: 4/19"
              maxLength={100}
            />
          </div>
        </div>

        <div className="modal__foot" style={{ flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onPreview}
            disabled={saving}
          >
            지금 미리보기
          </button>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onClose}
            disabled={saving}
          >
            취소
          </button>
          <button
            type="button"
            className="btn btn--primary"
            onClick={save}
            disabled={saving}
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
