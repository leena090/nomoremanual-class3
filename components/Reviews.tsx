"use client";

/**
 * 수강생 후기 섹션 — 클라이언트 컴포넌트
 * - Phosphor Star 아이콘으로 별점 표시
 * - 2+1 비대칭 그리드 레이아웃 (데스크탑: 2열 + 풀와이드 1개)
 * - 글래스 카드 효과 + 장식용 큰따옴표
 * - 그라데이션 배경 + StaggerReveal 스크롤 애니메이션
 */

import { Star } from "@phosphor-icons/react";
import { StaggerReveal, StaggerItem } from "./ScrollReveal";

/* 후기 데이터 타입 정의 */
interface Review {
  text: string; // 후기 본문
  author: string; // 작성자 정보
}

/* 1기 수강생 후기 데이터 — landing.html 원본 텍스트 그대로 */
const reviews: Review[] = [
  {
    text: "\u201C부동산 사무실 운영 중인데, 고객 문의 자동 분류 프로그램을 직접 만들었어요. 개발자 외주 맡기면 200만원인데... 수업 듣고 제가 만들었습니다.\u201D",
    author: "— 50대 · 부동산 사무소 운영",
  },
  {
    text: "\u201C어린이집 교사 퇴직 후 AI 콘텐츠 창업 준비 중이었는데, 수업 끝나고 바로 포트폴리오 웹사이트를 만들어서 배포까지 했어요. 제 인생에 이런 일이!\u201D",
    author: "— 50대 후반 · 전직 어린이집 교사",
  },
  {
    text: "\u201C유튜브 채널 운영하면서 썸네일 텍스트 생성기, 제목 추천기를 직접 만들었어요. 매주 2시간 절약 중입니다. 코딩 진짜 1도 몰라요.\u201D",
    author: "— 40대 · 유튜브 크리에이터",
  },
];

/* 별점 5개 렌더링 컴포넌트 — Phosphor Star 아이콘 사용 */
function StarRating() {
  return (
    <div className="flex gap-0.5 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={18} weight="fill" className="text-[#F5C36A]" />
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section
      className="py-20"
      style={{ background: "linear-gradient(180deg, #F5E6D3 0%, #EDD9C4 100%)" }}
    >
      <div className="max-w-[720px] mx-auto px-6">
        {/* 섹션 태그 뱃지 */}
        <span className="inline-block text-xs font-bold tracking-widest text-[#D4542B] bg-[#FFF0EB] px-3.5 py-1.5 rounded-full uppercase mb-5">
          1기 수강생 후기
        </span>

        {/* 섹션 제목 — "솔직한 이야기" 부분만 accent 색상 */}
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(26px,5vw,36px)] leading-[1.3] tracking-tight text-[#1A1A1A] mb-4">
          직접 들으신 분들의 <em className="not-italic text-[#D4542B]">솔직한 이야기</em>
        </h2>

        {/* 후기 카드 — 2+1 비대칭 그리드 (데스크탑: 상단 2열, 하단 풀와이드) */}
        <StaggerReveal className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reviews.map((review, idx) => (
            <StaggerItem
              key={idx}
              /* 3번째 카드(idx===2)는 풀와이드로 확장 */
              className={idx === 2 ? "lg:col-span-2" : ""}
            >
              {/* 글래스 카드 — 반투명 배경 + 블러 + 미세 테두리 */}
              <div className="relative bg-white/70 backdrop-blur-sm border border-white/40 shadow-sm rounded-2xl p-7">
                {/* 장식용 큰따옴표 — 카드 좌상단에 반투명하게 배치 */}
                <svg
                  className="absolute top-4 left-5 text-[#D4542B] opacity-[0.08]"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.192 11 15c0 1.934-1.567 3.5-3.5 3.5-1.14 0-2.272-.541-2.917-1.179zM14.583 17.321C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.69 21 13.192 21 15c0 1.934-1.567 3.5-3.5 3.5-1.14 0-2.272-.541-2.917-1.179z" />
                </svg>

                {/* 별점 — Phosphor Star 아이콘 5개 */}
                <StarRating />

                {/* 후기 본문 */}
                <div className="text-[15px] leading-[1.8] text-[#2D2D2D] mb-4">
                  {review.text}
                </div>

                {/* 작성자 정보 */}
                <div className="text-[13px] text-[#6B6B6B]">
                  {review.author}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
