"use client";

/**
 * FooterCTA — 페이지 하단 최종 전환 유도 섹션 (클라이언트 컴포넌트)
 * - 다크 배경 + 방사형 그라데이션 오버레이로 임팩트 강화
 * - 희소성 카피 + 글래스 효과 CTA 버튼 배치
 * - ScrollReveal 스크롤 애니메이션 적용
 */

import { ScrollReveal } from "./ScrollReveal";

export default function FooterCTA() {
  return (
    <section
      className="relative py-20 text-center text-white overflow-hidden"
      style={{
        /* 다크 배경 + 미묘한 방사형 그라데이션 오버레이 (Hero 패턴 응용) */
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(212,84,43,0.15) 0%, transparent 60%), #1A1A1A",
      }}
    >
      <div className="relative z-10 mx-auto max-w-[720px] px-6">
        {/* ScrollReveal로 전체 CTA 블록 등장 애니메이션 */}
        <ScrollReveal>
          {/* 메인 헤드라인 — 고민 중인 사용자에게 긴급성 전달 */}
          <h2
            className="mb-5 text-[clamp(26px,5vw,36px)] leading-[1.3] tracking-[-1px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            아직 고민 중이신가요?
          </h2>

          {/* 서브 카피 — 1기 마감 사실 + 2기 선착순 안내 */}
          <p
            className="mx-auto mb-9 max-w-[420px] text-[16px] leading-[1.8]"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            1기는 공지 3일 만에 마감됐습니다.
            <br />
            2기도 선착순 30명 마감됩니다.
          </p>

          {/* 소셜 프루프 — CTA 바로 위 신뢰 요소 */}
          <p
            className="mb-3 text-[0.85rem]"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            ⭐ 1기 수강생 만족도 4.9/5.0 · 수강생 전원 완주 · 100% 환불 보장
          </p>

          {/* CTA 버튼 — 글래스 효과 + 강화된 hover/active 애니메이션 */}
          <a
            href="#pricing"
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-none bg-[#D4542B]/90 backdrop-blur-sm px-10 py-[18px] text-[17px] font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(212,84,43,0.5)] active:scale-[0.98]"
            style={{ boxShadow: "0 4px 20px rgba(212,84,43,0.3)" }}
          >
            10시간 뒤, 나도 1인창업 대표님 →
          </a>

          {/* CTA 서브카피 */}
          <p
            className="mt-2 text-[0.85rem]"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            1기 수강생 만족도 4.9/5.0 · 전원 완주
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
