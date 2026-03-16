"use client";

import SeatCounter from "./SeatCounter";

// 가격 카드에 표시할 포함 항목 리스트
const features = [
  "2시간 × 4회 = 총 8시간 라이브 강의",
  "1기 검증 완료된 커리큘럼 (만족도 4.9)",
  "CLAUDE.md + skill 파일 템플릿 패키지",
  "유형별 맞춤 실습 (유튜브/창업/업무자동화)",
  "수강생 전용 커뮤니티 평생 접근",
  "강의 녹화본 제공 (복습용)",
  "전자책 3종 무료 증정 (출간 시)",
  "수강 후 1:1 질문 무제한 (1개월)",
];

// Props 타입 — 모달 오픈 콜백 함수
interface PricingProps {
  onOpenModal: () => void;
}

// 수강료 섹션 컴포넌트 — 얼리버드 가격 카드 + CTA 버튼
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

        {/* 가격 카드 — accent 보더, 중앙 정렬 */}
        <div className="bg-white border-2 border-[#D4542B] rounded-[20px] px-8 py-10 text-center relative">
          {/* 상단 라벨 뱃지 — 카드 위에 걸쳐서 표시 */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[13px] font-bold text-white bg-[#D4542B] px-5 py-1.5 rounded-full whitespace-nowrap">
            2기 얼리버드 — 선착순 30명
          </div>

          {/* 정가 (취소선) */}
          <div className="text-lg text-[#6B6B6B] line-through mt-3 mb-1">
            정가 550,000원
          </div>

          {/* 할인가 (큰 폰트, display 폰트) */}
          <div className="font-[family-name:var(--font-display)] text-[clamp(36px,8vw,48px)] text-[#1A1A1A] mb-2">
            385,000원
          </div>

          {/* 할부 안내 */}
          <div className="text-sm text-[#6B6B6B] mb-7">
            카드 3개월 무이자 가능 · 월 128,333원
          </div>

          {/* 포함 항목 리스트 — 좌측 정렬, 체크 아이콘 */}
          <ul className="list-none text-left mb-8">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="text-[15px] py-2.5 border-b border-[#F0EDE5] pl-7 relative before:content-['✓'] before:absolute before:left-0 before:text-[#2E7D32] before:font-black"
              >
                {feature}
              </li>
            ))}
          </ul>

          {/* 소셜 프루프 — CTA 바로 위 신뢰 요소 */}
          <p className="text-[0.85rem] text-[#6B6B6B] mb-3">
            ⭐ 1기 수강생 만족도 4.9/5.0 · 수강생 전원 완주 · 100% 환불 보장
          </p>

          {/* CTA 버튼 — 전체 너비, 최소 높이 48px (50대+ 대상) */}
          <button
            onClick={onOpenModal}
            className="w-full inline-flex items-center justify-center gap-2 text-[17px] font-bold text-white bg-[#D4542B] border-none rounded-xl py-[18px] px-10 cursor-pointer transition-all duration-200 shadow-[0_4px_20px_rgba(212,84,43,0.3)] hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(212,84,43,0.4)] min-h-[48px]"
          >
            AI 직원 고용하기 — 385,000원 →
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
      </div>
    </section>
  );
}
