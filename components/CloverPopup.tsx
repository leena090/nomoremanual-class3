"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * CloverPopup — 네잎클로버 행운 팝업
 * - 페이지 로드 3초 후 네잎클로버가 금가루와 함께 페이드인
 * - 클릭하면 5060 대상 따뜻한 동기부여 멘트 표시
 * - 수강 신청 버튼 + 닫기 버튼 포함
 */
interface CloverPopupProps {
  onOpenModal: () => void;
}

/* 5060 대상 따뜻한 동기부여 멘트 목록 — 랜덤 1개 선택 */
const MESSAGES = [
  "지금 이 페이지를 보고 계신 것만으로도\n이미 변화가 시작된 거예요. 🍀",
  "늦은 시작은 없습니다.\n오늘이 가장 빠른 날이에요. 🍀",
  "AI는 어려운 게 아니라\n아직 안 해본 것일 뿐이에요. 🍀",
  "당신의 경험에 AI를 더하면\n누구도 따라올 수 없는 실력이 됩니다. 🍀",
  "용기 내어 클릭하신 당신,\n이미 절반은 성공하셨어요. 🍀",
];

export default function CloverPopup({ onOpenModal }: CloverPopupProps) {
  /* 클로버 버튼 표시 여부 */
  const [showClover, setShowClover] = useState(false);
  /* 메시지 카드 표시 여부 */
  const [showMessage, setShowMessage] = useState(false);
  /* 전체 팝업 닫힘 여부 */
  const [dismissed, setDismissed] = useState(false);
  /* 선택된 멘트 인덱스 */
  const [messageIndex, setMessageIndex] = useState(0);
  /* 금가루 파티클 데이터 — 클라이언트에서만 생성 */
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      left: string;
      top: string;
      delay: string;
      duration: string;
      size: string;
    }>
  >([]);

  /* 3초 후 클로버 페이드인 + 랜덤 멘트 선택 */
  useEffect(() => {
    /* 이미 닫은 세션이면 표시하지 않음 */
    if (sessionStorage.getItem("clover-dismissed")) return;

    const timer = setTimeout(() => {
      setMessageIndex(Math.floor(Math.random() * MESSAGES.length));
      /* 금가루 파티클 생성 (CSR에서만) */
      setParticles(
        Array.from({ length: 12 }, (_, i) => ({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          delay: `${Math.random() * 2}s`,
          duration: `${2 + Math.random() * 3}s`,
          size: `${3 + Math.random() * 4}px`,
        }))
      );
      setShowClover(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  /* 클로버 클릭 → 멘트 카드 오픈 */
  const handleCloverClick = useCallback(() => {
    setShowMessage(true);
  }, []);

  /* 닫기 */
  const handleDismiss = useCallback(() => {
    setDismissed(true);
    sessionStorage.setItem("clover-dismissed", "true");
  }, []);

  /* 수강 신청 클릭 */
  const handleEnroll = useCallback(() => {
    handleDismiss();
    onOpenModal();
  }, [handleDismiss, onOpenModal]);

  /* 닫혔거나 아직 안 보여주는 상태 */
  if (dismissed || !showClover) return null;

  return (
    <>
      {/* ── 메시지 카드가 열리면 오버레이 표시 ── */}
      {showMessage && (
        <div
          className="fixed inset-0 bg-black/40 z-[9998] transition-opacity duration-500"
          onClick={handleDismiss}
        />
      )}

      {/* ── 메시지 카드 (클로버 클릭 후 표시) ── */}
      {showMessage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="clover-message-card bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center relative overflow-hidden">
            {/* 상단 장식 — 금빛 라인 */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 via-yellow-400 to-green-400" />

            {/* 네잎클로버 아이콘 */}
            <div className="text-5xl mb-5">🍀</div>

            {/* 행운 라벨 */}
            <p className="text-sm font-medium text-green-600 mb-3 tracking-wider">
              오늘의 행운 메시지
            </p>

            {/* 동기부여 멘트 */}
            <p className="text-lg leading-relaxed text-gray-800 font-medium whitespace-pre-line mb-8">
              {MESSAGES[messageIndex]}
            </p>

            {/* 수강 신청 버튼 */}
            <button
              onClick={handleEnroll}
              className="w-full py-4 rounded-2xl text-white font-bold text-base bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-green-200"
            >
              행운을 잡으러 가기 →
            </button>

            {/* 닫기 버튼 */}
            <button
              onClick={handleDismiss}
              className="mt-3 w-full py-3 rounded-2xl text-gray-400 text-sm hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
            >
              다음에 할게요
            </button>
          </div>
        </div>
      )}

      {/* ── 플로팅 클로버 버튼 (좌측 하단) ── */}
      {!showMessage && (
        <div className="fixed bottom-28 left-5 z-[9997] clover-enter">
          {/* 금가루 파티클 컨테이너 */}
          <div className="relative">
            {/* 금가루 반짝임 */}
            {particles.map((p) => (
              <span
                key={p.id}
                className="clover-sparkle absolute rounded-full bg-yellow-400/80 pointer-events-none"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  "--delay": p.delay,
                  "--dur": p.duration,
                } as React.CSSProperties}
              />
            ))}

            {/* 클로버 버튼 */}
            <button
              onClick={handleCloverClick}
              className="clover-btn relative w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center cursor-pointer select-none hover:scale-110 active:scale-95 transition-transform duration-200"
              aria-label="행운의 클로버 클릭"
            >
              <span className="text-3xl leading-none">🍀</span>
            </button>

            {/* "클릭!" 라벨 */}
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-md animate-bounce">
              클릭!
            </span>
          </div>
        </div>
      )}
    </>
  );
}
