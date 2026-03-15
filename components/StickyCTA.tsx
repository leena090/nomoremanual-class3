"use client";

/**
 * StickyCTA — 모바일 전용 하단 고정 CTA 버튼 (클라이언트 컴포넌트)
 * - 화면 하단에 고정되어 항상 노출
 * - md(768px) 이상에서는 Tailwind md:hidden으로 숨김
 * - 클릭 시 부모로부터 전달받은 onOpenModal 실행
 */
interface StickyCTAProps {
  onOpenModal: () => void;
}

export default function StickyCTA({ onOpenModal }: StickyCTAProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        /* 흰색 배경 + 상단 보더 + 그림자로 콘텐츠와 분리 */
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E0DDD5",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.08)",
      }}
    >
      {/* 내부 패딩 — safe area 대응 포함 */}
      <div className="px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        {/* 풀 너비 CTA 버튼 */}
        <button
          onClick={onOpenModal}
          className="w-full cursor-pointer rounded-xl border-none bg-[#D4542B] py-[16px] text-[16px] font-bold text-white transition-opacity duration-200 active:opacity-90"
        >
          2기 신청하기 — 385,000원 →
        </button>
      </div>
    </div>
  );
}
