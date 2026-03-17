"use client";

/**
 * 수강료 섹션 — 얼리버드 가격 카드 + CTA 버튼
 * - Phosphor Check 아이콘으로 체크 마크 표시
 * - Outfit 폰트(--font-accent)로 가격 숫자 표시
 * - 글래스 카드 + 그라데이션 상단 뱃지
 * - 향상된 CTA 호버 효과 + ScrollReveal 적용
 */

import { Check } from "@phosphor-icons/react";
import SeatCounter from "./SeatCounter";
import { ScrollReveal } from "./ScrollReveal";

/* 가격 카드에 표시할 포함 항목 리스트 */
const features = [
  "2.5시간 × 4회 = 총 10시간 라이브 강의",
  "1기 검증 완료된 커리큘럼 (만족도 4.9)",
  "CLAUDE.md + skill 파일 템플릿 패키지",
  "유형별 맞춤 실습 (유튜브/창업/업무자동화)",
  "수강생 전용 커뮤니티 평생 접근",
  "강의 녹화본 제공 (복습용)",
  "전자책 3종 무료 증정 (출간 시)",
  "수강 후 1:1 질문 무제한 (1개월)",
];

/* Props 타입 — 모달 오픈 콜백 함수 */
interface PricingProps {
  onOpenModal: () => void;
}

/* 수강료 섹션 컴포넌트 — 얼리버드 가격 카드 + CTA 버튼 */
export default function Pricing({ onOpenModal }: PricingProps) {
  return (
    <section className="py-20 border-t border-[#E0DDD5]" id="pricing">
      <div className="max-w-[720px] mx-auto px-6">
        {/* 섹션 태그 뱃지 */}
        <span className="inline-block text-xs font-bold tracking-widest text-[#D4542B] bg-[#FFF0EB] px-3.5 py-1.5 rounded-full uppercase mb-5">
          수강료
        </span>

        {/* 섹션 제목 — "얼리버드" 부분만 accent 색상 */}
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(26px,5vw,36px)] leading-[1.3] tracking-tight text-[#1A1A1A] mb-4">
          2기 <em className="not-italic text-[#D4542B]">얼리버드</em> 특별가
        </h2>

        {/* 부제목 — 마감 안내 */}
        <p className="text-[#6B6B6B] mb-10">
          선착순 30명 마감 후 정가 복원
        </p>

        {/* 가격 카드 — 글래스 효과 + 부드러운 그림자 */}
        <ScrollReveal>
          <div className="bg-white/90 backdrop-blur-sm shadow-lg shadow-[#D4542B]/10 border border-[#D4542B]/30 rounded-[20px] px-8 py-10 text-center relative">
            {/* 상단 라벨 뱃지 — 그라데이션 배경으로 세련되게 */}
            <div
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[13px] font-bold text-white px-5 py-1.5 rounded-full whitespace-nowrap"
              style={{ background: "linear-gradient(to right, #D4542B, #E06B45)" }}
            >
              2기 얼리버드 — 선착순 30명
            </div>

            {/* 정가 (취소선) — Outfit 폰트 적용 */}
            <div
              className="text-lg text-[#6B6B6B] line-through mt-3 mb-1"
              style={{ fontFamily: "var(--font-accent)" }}
            >
              정가 550,000원
            </div>

            {/* 할인가 (큰 폰트) — Outfit 폰트 적용 */}
            <div
              className="text-[clamp(36px,8vw,48px)] text-[#1A1A1A] mb-2 font-bold"
              style={{ fontFamily: "var(--font-accent)" }}
            >
              385,000원
            </div>

            {/* 할부 안내 — Outfit 폰트 적용 */}
            <div
              className="text-sm text-[#6B6B6B] mb-7"
              style={{ fontFamily: "var(--font-accent)" }}
            >
              카드 3개월 무이자 가능 · 월 128,333원
            </div>

            {/* 포함 항목 리스트 — Check 아이콘 + flex 레이아웃 */}
            <ul className="list-none text-left mb-8">
              {features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-[15px] py-2.5 border-b border-[#F0EDE5]"
                >
                  {/* Phosphor Check 아이콘 — 녹색 체크 마크 */}
                  <Check size={18} weight="bold" className="text-[#2E7D32] shrink-0 mt-[3px]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* 소셜 프루프 — CTA 바로 위 신뢰 요소 */}
            <p className="text-[0.85rem] text-[#6B6B6B] mb-3">
              ⭐ 1기 수강생 만족도 4.9/5.0 · 수강생 전원 완주 · 100% 환불 보장
            </p>

            {/* CTA 버튼 — 향상된 호버 효과 (그림자 확대 + 미세 스케일) */}
            <button
              onClick={onOpenModal}
              className="w-full inline-flex items-center justify-center gap-2 text-[17px] font-bold text-white bg-[#D4542B] border-none rounded-xl py-[18px] px-10 cursor-pointer transition-all duration-200 shadow-[0_4px_20px_rgba(212,84,43,0.3)] hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(212,84,43,0.4)] hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
            >
              10시간 뒤, 나도 1인창업 대표님 — 385,000원 →
            </button>

            {/* CTA 서브카피 */}
            <p className="text-[0.85rem] text-[#6B6B6B] mt-2">
              1기 수강생 만족도 4.9/5.0 · 전원 완주
            </p>

            {/* 결제 수단 안내 */}
            <p className="text-[13px] text-[#6B6B6B] mt-4">
              토스페이먼츠 안전결제 · 카드/계좌이체/간편결제
            </p>

            {/* 잔여석 카운터 */}
            <SeatCounter />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
