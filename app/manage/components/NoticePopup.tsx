"use client";

/**
 * 전체공지 팝업 — 스플래시 통과 후 첫 노출.
 * NMM Design System v2 톤: Warm Paper 배경, Deep Walnut 텍스트, Burnt Amber 악센트.
 * "오늘 하루 보지 않기" 선택 시 localStorage에 오늘 날짜 저장 → 자정 지나면 다시 노출.
 *
 * 공지 내용은 서버에서 로드된 Notice 객체(DB 기반). 관리자 모드에서 NoticeEditor로 편집.
 */

import { useEffect } from "react";
import type { Notice } from "../types";

const LS_HIDE_KEY = "manage:notice:hideDate";

/* 오늘 날짜 로컬 기준 YYYY-MM-DD */
function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* 본문 단락 분리 — 빈 줄(\n\n) 기준, 단일 줄바꿈은 한 단락 내부 줄바꿈으로 유지 */
function splitParagraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

export function NoticePopup({
  notice,
  onClose,
}: {
  notice: Notice;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hideForToday = () => {
    try {
      localStorage.setItem(LS_HIDE_KEY, todayKey());
    } catch {
      /* 프라이빗 모드 등에서는 무시 */
    }
    onClose();
  };

  const paragraphs = splitParagraphs(notice.body);

  return (
    <div
      className="notice-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-title"
    >
      <div
        className="notice-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="notice-close"
          aria-label="닫기"
          onClick={onClose}
        >
          ×
        </button>

        {notice.eyebrow && (
          <div className="notice-eyebrow">{notice.eyebrow}</div>
        )}
        <h2 id="notice-title" className="notice-title">
          {notice.title}
        </h2>

        <div className="notice-divider" aria-hidden="true" />

        <div className="notice-body">
          {paragraphs.map((p, i) => (
            <p key={i} style={{ whiteSpace: "pre-line" }}>
              {p}
            </p>
          ))}
        </div>

        {notice.foot_note && (
          <p className="notice-foot-note">{notice.foot_note}</p>
        )}

        <div className="notice-actions">
          <button
            type="button"
            className="notice-btn notice-btn--ghost"
            onClick={hideForToday}
          >
            오늘 하루 보지 않기
          </button>
          <button
            type="button"
            className="notice-btn notice-btn--primary"
            onClick={onClose}
          >
            확인했어요
          </button>
        </div>
      </div>
    </div>
  );
}

/* 오늘 하루 숨김 상태인지 확인 — ClientShell에서 마운트 직후 사용 */
export function shouldShowNotice(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const saved = localStorage.getItem(LS_HIDE_KEY);
    return saved !== todayKey();
  } catch {
    return true;
  }
}

/* 관리자 미리보기/토글용 — 숨김 플래그 초기화 */
export function clearNoticeHide(): void {
  try {
    localStorage.removeItem(LS_HIDE_KEY);
  } catch {
    /* noop */
  }
}
