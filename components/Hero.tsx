"use client";

import CountdownTimer from "./CountdownTimer";

/**
 * 히어로 섹션 컴포넌트
 * - 다크 그라데이션 배경 + 라디얼 오버레이
 * - 모집 배지, 메인 카피, CTA 버튼, 카운트다운, 실적 통계
 * - onOpenModal prop으로 결제/신청 모달 트리거
 */
interface HeroProps {
  onOpenModal: () => void;
}

export default function Hero({ onOpenModal }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden py-[100px] pb-20 text-center text-white"
      style={{
        background: "linear-gradient(175deg, #1A1A1A 0%, #2D2520 100%)",
      }}
    >
      {/* 라디얼 그라데이션 오버레이 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212,84,43,0.15) 0%, transparent 60%)",
        }}
      />

      {/* 콘텐츠 래퍼 (오버레이 위로 올리기 위해 relative) */}
      <div className="relative mx-auto max-w-[720px] px-6">
        {/* 모집 배지 — 골드 색상 + 펄스 닷 */}
        <div
          className="mb-7 inline-flex items-center gap-1.5 rounded-full border px-[18px] py-2 text-[13px] font-bold text-[#F5C36A]"
          style={{
            background: "rgba(245,195,106,0.12)",
            borderColor: "rgba(245,195,106,0.25)",
          }}
        >
          {/* 펄스 애니메이션 닷 */}
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#F5C36A]" />
          2기 모집 중 — 선착순 30명
        </div>

        {/* 메인 헤드라인 */}
        <h1
          className="mb-5 text-[clamp(32px,7vw,52px)] leading-[1.25] tracking-[-2px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          코딩 1도 모르는 50대가
          <br />
          <span className="text-[#F5C36A]">클로드로 앱을 만들었습니다</span>
        </h1>

        {/* 서브 카피 */}
        <p
          className="mx-auto mb-9 max-w-[480px] text-[17px] leading-[1.7]"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          코워크, 클로드 코드, 웹 활용까지
          <br />
          8시간 만에 AI 직원 한 명 고용하는 법
        </p>

        {/* 소셜 프루프 — CTA 바로 위 신뢰 요소 */}
        <p
          className="mb-3 text-[0.85rem]"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          ⭐ 1기 수강생 만족도 4.9/5.0 · 수강생 전원 완주 · 100% 환불 보장
        </p>

        {/* CTA 버튼 — 클릭 시 모달 오픈 */}
        <button
          onClick={onOpenModal}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-none bg-[#D4542B] px-10 py-[18px] text-[17px] font-bold text-white transition-transform duration-200 hover:-translate-y-0.5"
          style={{
            fontFamily: "var(--font-body)",
            boxShadow: "0 4px 20px rgba(212,84,43,0.3)",
          }}
        >
          8시간 뒤, 나도 앱 만드는 사람 →
        </button>

        {/* CTA 서브카피 */}
        <p
          className="mt-2 text-[0.85rem]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          1기 수강생 만족도 4.9/5.0 · 전원 완주
        </p>

        {/* 수강생 결과물 시각화 — placeholder (이미지 추가 필요) */}
        {/* TODO: 수강생 결과물 이미지 3~4장 추가 필요 */}
        <div className="mt-8 grid grid-cols-3 gap-3 max-[600px]:flex max-[600px]:gap-3 max-[600px]:overflow-x-auto max-[600px]:snap-x max-[600px]:snap-mandatory max-[600px]:-mx-6 max-[600px]:px-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl max-[600px]:min-w-[70vw] max-[600px]:snap-center"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px dashed rgba(255,255,255,0.15)",
              }}
            >
              {/* 이미지 플레이스홀더 — next/image + WebP + lazy loading 적용 예정 */}
              <div className="flex h-full items-center justify-center text-[0.8rem]" style={{ color: "rgba(255,255,255,0.3)" }}>
                수강생 결과물 {i}
              </div>
            </div>
          ))}
        </div>

        {/* 카운트다운 타이머 */}
        <div className="mt-3">
          <CountdownTimer />
        </div>

        {/* 실적 통계 */}
        <div
          className="mt-10 flex justify-center gap-10 border-t pt-8 max-[600px]:gap-5"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          {/* 1기 완판 */}
          <div className="text-center">
            <div
              className="text-[28px] text-white max-[600px]:text-[22px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              1기 완판
            </div>
            <div
              className="mt-1 text-[13px]"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              수강생 전원 완주
            </div>
          </div>

          {/* 만족도 */}
          <div className="text-center">
            <div
              className="text-[28px] text-white max-[600px]:text-[22px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              만족도 4.9
            </div>
            <div
              className="mt-1 text-[13px]"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              5점 만점
            </div>
          </div>

          {/* 교육 경력 */}
          <div className="text-center">
            <div
              className="text-[28px] text-white max-[600px]:text-[22px]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              20년
            </div>
            <div
              className="mt-1 text-[13px]"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              교육 경력
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
