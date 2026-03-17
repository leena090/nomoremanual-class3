"use client";

/**
 * 만족 보장 섹션 — 클라이언트 컴포넌트 (ScrollReveal 사용)
 * - 1회차 수업 후 전액 환불 보장 안내 박스
 * - Phosphor ShieldCheck 아이콘으로 신뢰감 표현
 * - ScrollReveal 스크롤 애니메이션 적용
 */

import { ShieldCheck } from "@phosphor-icons/react";
import { ScrollReveal } from "./ScrollReveal";

export default function Guarantee() {
  return (
    <section className="py-20 border-t border-[#E0DDD5]">
      <div className="max-w-[720px] mx-auto px-6">
        {/* ScrollReveal로 보장 박스 등장 애니메이션 */}
        <ScrollReveal>
          {/* 보장 박스 — 연한 녹색 배경, 녹색 보더 */}
          <div className="bg-[#E8F5E9] border-2 border-[#A5D6A7] rounded-2xl p-9 text-center">
            {/* 방패 체크 아이콘 — Phosphor duotone 스타일 */}
            <div className="mb-4 flex justify-center">
              <ShieldCheck size={40} weight="duotone" className="text-[#2E7D32]" />
            </div>

            {/* 제목 — display 폰트, 24px */}
            <h2 className="font-[family-name:var(--font-display)] text-[24px] text-[#1A1A1A] mb-3">
              100% 만족 보장
            </h2>

            {/* 환불 정책 설명 — "전액 환불" 부분 녹색 볼드 강조 */}
            <p className="text-[#6B6B6B] mt-3 max-w-[480px] mx-auto leading-[1.75]">
              1회차 수업을 듣고 &ldquo;이건 내 스타일이 아니다&rdquo; 싶으시면
              <br />
              <strong className="text-[#2E7D32]">이유 불문, 질문 없이 전액 환불</strong>해 드립니다.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
