"use client";

import { useState, useEffect } from "react";

/**
 * StickyCTA — 모바일+데스크톱 하단 고정 CTA 버튼 (클라이언트 컴포넌트)
 * - Intersection Observer로 히어로 영역 보일 때 숨김
 * - 반투명 다크 배경 + backdrop-blur로 글래스 효과
 * - 버튼 높이 56px 이상, 서브카피 포함
 */
interface StickyCTAProps {
  onOpenModal: () => void;
}

export default function StickyCTA({ onOpenModal }: StickyCTAProps) {
  /* 히어로 섹션이 뷰포트에 보이면 스티키 CTA 숨김 */
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    /* 히어로 섹션 요소 탐색 (첫 번째 section 태그 = 히어로) */
    const heroSection = document.querySelector("section");
    if (!heroSection) {
      setIsVisible(true);
      return;
    }

    /* Intersection Observer — 히어로가 보이면 숨기고, 안 보이면 표시 */
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(heroSection);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        /* 반투명 다크 배경 — backdrop-blur와 조합하여 글래스 효과 */
        backgroundColor: "rgba(26,26,26,0.85)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        /* 강화된 상단 그림자 — 콘텐츠와의 분리감 */
        boxShadow: "0 -4px 30px rgba(0,0,0,0.3)",
      }}
    >
      {/* 내부 패딩 — safe area 대응 포함 */}
      <div className="mx-auto max-w-[720px] px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        {/* 풀 너비 CTA 버튼 — 최소 높이 56px */}
        <button
          onClick={onOpenModal}
          className="w-full cursor-pointer rounded-xl border-none bg-[#D4542B] py-[16px] text-[16px] font-bold text-white transition-opacity duration-200 active:opacity-90"
          style={{ minHeight: "56px" }}
        >
          8시간 뒤, 나도 1인창업 대표님 →
        </button>

        {/* 서브카피 — 희소성 + 신뢰 */}
        <p className="mt-1.5 text-center text-[0.8rem]" style={{ color: "rgba(255,255,255,0.5)" }}>
          선착순 마감 · 100% 환불 보장
        </p>
      </div>
    </div>
  );
}
