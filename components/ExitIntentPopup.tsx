"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * ExitIntentPopup — 이탈 감지 팝업 (클라이언트 컴포넌트)
 * - 데스크톱: 마우스가 뷰포트 상단 밖으로 나갈 때 (clientY < 0)
 * - 모바일: 하단 도달 후 빠른 상향 스크롤 감지
 * - sessionStorage로 세션당 1회 제한
 * - 후기 인용 + CTA + 닫기 버튼
 */
interface ExitIntentPopupProps {
  onOpenModal: () => void;
}

export default function ExitIntentPopup({ onOpenModal }: ExitIntentPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  /* 팝업 닫기 — sessionStorage에 표시 기록 */
  const closePopup = useCallback(() => {
    setIsOpen(false);
    sessionStorage.setItem("exitIntentShown", "true");
  }, []);

  /* CTA 클릭 — 팝업 닫고 모달 열기 */
  const handleCTA = useCallback(() => {
    closePopup();
    onOpenModal();
  }, [closePopup, onOpenModal]);

  /* 팝업 표시 트리거 — 세션당 1회 제한 */
  const showPopup = useCallback(() => {
    if (sessionStorage.getItem("exitIntentShown")) return;
    setIsOpen(true);
  }, []);

  useEffect(() => {
    /* 이미 표시된 적 있으면 이벤트 리스너 등록 안 함 */
    if (sessionStorage.getItem("exitIntentShown")) return;

    /* 데스크톱: mouseout 감지 — 마우스가 뷰포트 상단으로 나갈 때 */
    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY < 0) {
        showPopup();
      }
    };

    /* 모바일: 하단 도달 후 빠른 상향 스크롤 감지 */
    let lastScrollY = 0;
    let reachedBottom = false;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      /* 하단 90% 이상 도달 기록 */
      if (currentY >= maxScroll * 0.9) {
        reachedBottom = true;
      }

      /* 하단 도달 후 빠르게 위로 스크롤 (100px 이상) */
      if (reachedBottom && lastScrollY - currentY > 100) {
        showPopup();
        reachedBottom = false;
      }

      lastScrollY = currentY;
    };

    document.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showPopup]);

  if (!isOpen) return null;

  return (
    /* 오버레이 배경 */
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={closePopup}
    >
      {/* 팝업 카드 */}
      <div
        className="relative w-full max-w-[420px] rounded-2xl bg-white p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={closePopup}
          className="absolute right-4 top-4 cursor-pointer border-none bg-transparent text-[20px] text-[#6B6B6B] hover:text-[#1A1A1A]"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* 헤드라인 */}
        <h3
          className="mb-3 text-[clamp(20px,4vw,24px)] leading-[1.3] text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          잠깐, 이것만 보고 가세요!
        </h3>

        {/* 수강생 후기 인용 */}
        <blockquote
          className="mb-6 rounded-xl px-5 py-4 text-left text-[15px] leading-[1.8]"
          style={{
            background: "#FFF8F5",
            borderLeft: "3px solid #D4542B",
            color: "#4A4A4A",
          }}
        >
          &ldquo;진짜 코딩 1도 모르는데 앱을 만들었습니다.
          <br />
          제 인생에서 가장 잘한 투자예요.&rdquo;
          <cite
            className="mt-2 block text-[13px] not-italic"
            style={{ color: "#6B6B6B" }}
          >
            — 1기 수강생 (50대, 자영업)
          </cite>
        </blockquote>

        {/* CTA 버튼 */}
        <button
          onClick={handleCTA}
          className="w-full cursor-pointer rounded-xl border-none bg-[#D4542B] py-[16px] text-[16px] font-bold text-white transition-transform duration-200 hover:-translate-y-0.5"
          style={{ boxShadow: "0 4px 20px rgba(212,84,43,0.3)" }}
        >
          8시간 뒤, 나도 1인창업 대표님 →
        </button>

        {/* 서브카피 */}
        <p className="mt-2 text-[0.8rem] text-[#6B6B6B]">
          선착순 마감 · 100% 환불 보장
        </p>
      </div>
    </div>
  );
}
