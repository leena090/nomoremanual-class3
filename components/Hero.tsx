"use client";

import CountdownTimer from "./CountdownTimer";
import { ScrollReveal } from "./ScrollReveal";

/**
 * 히어로 섹션 컴포넌트 (배경 영상 버전 — 컴팩트)
 * - 배경: 루프 재생 영상 + 안쪽으로 흐려지는 마스킹 그라데이션
 * - 레이아웃: 가운데 정렬, 한 화면(100vh)에 모든 요소가 보이도록 컴팩트 배치
 * - 통계바를 CTA 바로 아래에 배치하여 높이 절약
 */
interface HeroProps {
  onOpenModal: () => void;
}

export default function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden text-center text-white">
      {/* ── 배경 영상 ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* ── 다크 오버레이 — 75% 어둡게 ── */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-black/75" />

      {/* ── 마스킹 그라데이션 (상하좌우 비네팅) ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: `
            linear-gradient(to bottom, rgba(26,26,26,0.6) 0%, transparent 20%, transparent 65%, rgba(26,26,26,0.95) 100%),
            linear-gradient(to right, rgba(26,26,26,0.4) 0%, transparent 15%, transparent 85%, rgba(26,26,26,0.4) 100%)
          `,
        }}
      />

      {/* ── 라디얼 비네팅 — 시선 중앙 유도 ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: "radial-gradient(ellipse at 50% 45%, transparent 25%, rgba(26,26,26,0.55) 100%)",
        }}
      />

      {/* ── 상단 액센트 빛 ── */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(212,84,43,0.1) 0%, transparent 45%)",
        }}
      />

      {/* ── 메인 콘텐츠 — 수직 중앙 정렬 ── */}
      <div className="relative z-[3] mx-auto max-w-[720px] px-6">
        {/* 모집 배지 */}
        <ScrollReveal delay={0}>
          <div
            className="mb-5 inline-flex items-center gap-1.5 rounded-full border px-[18px] py-2 text-[13px] font-bold text-[#F5C36A]"
            style={{
              background: "rgba(245,195,106,0.15)",
              borderColor: "rgba(245,195,106,0.3)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#F5C36A]" />
            3기 모집 중
          </div>
        </ScrollReveal>

        {/* 메인 헤드라인 */}
        <ScrollReveal delay={0.1}>
          <h1
            className="mb-4 text-[clamp(30px,6.5vw,52px)] leading-[1.2] tracking-[-2px]"
            style={{
              fontFamily: "var(--font-display)",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            코딩 1도 모르는 50대가
            <br />
            <span className="text-[#F5C36A]">클로드로 1인창업에 성공</span>
          </h1>
        </ScrollReveal>

        {/* 서브 카피 */}
        <ScrollReveal delay={0.15}>
          <p
            className="mx-auto mb-6 max-w-[460px] text-[16px] leading-[1.65]"
            style={{ color: "rgba(255,255,255,0.85)", textShadow: "0 1px 10px rgba(0,0,0,0.4)" }}
          >
            코워크, 클로드 코드, 웹 활용까지
            <br />
            8시간 만에 AI 직원 한 명 고용하는 법
          </p>
        </ScrollReveal>

        {/* 소셜 프루프 */}
        <ScrollReveal delay={0.2}>
          <p className="mb-3 text-[0.82rem]" style={{ color: "rgba(255,255,255,0.55)" }}>
            ⭐ 1·2기 만족도 4.9/5.0 · 전원 완주 · 100% 환불 보장
          </p>
        </ScrollReveal>

        {/* CTA 버튼 — 슬롯 도미노 정지 후 금빛 글로우 + 떠올랐다 가라앉는 효과 */}
        <ScrollReveal delay={0.25}>
          <div className="relative inline-block">
            {/* 금빛 글로우 배경 — 2.5초 후 슬로우로 빛나고 짠! 하고 2초 유지 후 사그라듦 */}
            <div
              className="pointer-events-none absolute -inset-5 rounded-2xl opacity-0"
              style={{
                background: "radial-gradient(ellipse at 50% 50%, rgba(255,200,80,1) 0%, rgba(245,180,60,0.6) 35%, rgba(212,84,43,0.25) 65%, transparent 85%)",
                animation: "ctaGlow 7s ease-in-out 2.5s forwards",
              }}
            />
            <button
              onClick={onOpenModal}
              data-cta="hero-main"
              className="relative inline-flex cursor-pointer items-center gap-2 rounded-xl border-none bg-[#D4542B] px-10 py-[16px] text-[17px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,84,43,0.5)] active:scale-[0.98]"
              style={{
                fontFamily: "var(--font-body)",
                boxShadow: "0 4px 24px rgba(212,84,43,0.4)",
                animation: "ctaFloat 7s ease-in-out 2.5s forwards",
              }}
            >
              8시간 뒤, 나도 1인창업 대표님 →
            </button>
          </div>
        </ScrollReveal>

        {/* 카운트다운 타이머 — CTA 바로 아래 */}
        <ScrollReveal delay={0.3}>
          <div className="mt-4">
            <CountdownTimer />
          </div>
        </ScrollReveal>

        {/* ── 실적 통계바 — 인라인으로 배치하여 높이 절약 ── */}
        <ScrollReveal delay={0.35}>
          <div
            className="mx-auto mt-8 flex justify-center gap-8 rounded-2xl px-6 py-4 max-[600px]:gap-4 max-[600px]:px-3"
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* 1기 완판 */}
            <div className="text-center">
              <div className="text-[22px] text-white max-[600px]:text-[18px]" style={{ fontFamily: "var(--font-display)" }}>
                1·2기 완판
              </div>
              <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>전원 완주</div>
            </div>

            {/* 구분선 */}
            <div className="w-px self-stretch" style={{ background: "rgba(255,255,255,0.1)" }} />

            {/* 만족도 */}
            <div className="text-center">
              <div className="text-[22px] text-white max-[600px]:text-[18px]" style={{ fontFamily: "var(--font-display)" }}>
                만족도 4.9
              </div>
              <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>5점 만점</div>
            </div>

            {/* 구분선 */}
            <div className="w-px self-stretch" style={{ background: "rgba(255,255,255,0.1)" }} />

            {/* 교육 경력 */}
            <div className="text-center">
              <div className="text-[22px] text-white max-[600px]:text-[18px]" style={{ fontFamily: "var(--font-display)" }}>
                20년
              </div>
              <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>교육 경력</div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
