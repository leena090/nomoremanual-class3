"use client";

/**
 * 커리큘럼 섹션 — 4주차 아코디언 형태
 * - CaretDown 아이콘으로 토글 표시 (회전 애니메이션)
 * - ArrowRight 아이콘으로 리스트 항목 마커
 * - 주차 번호 뱃지: 아웃라인 스타일 (테두리만)
 * - framer-motion AnimatePresence로 부드러운 높이 전환
 * - ScrollReveal 스크롤 애니메이션 적용
 */

import { useState } from "react";
import { CaretDown, ArrowRight } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import Link from "next/link";

/* 커리큘럼 주차별 데이터 타입 정의 */
interface WeekData {
  number: number; // 주차 번호
  title: string; // 주차 제목
  items: string[]; // 학습 항목 리스트
}

/* 4주 커리큘럼 데이터 */
const weeks: WeekData[] = [
  {
    number: 1,
    title: '클로드의 숨겨진 세계 — "이런 것도 돼?"',
    items: [
      "프로젝트·아티팩트·데스크톱 MCP — 아는 사람만 아는 기능들",
      "사용량 관리 꿀팁 (돈 아끼는 비법)",
      '메모리·응답 스타일 커스텀 — "내 말투로 답해줘"를 설정으로 박기',
      "실습: 코워크로 엑셀 파일 분석 → 보고서 자동 생성",
      "실습: PPT 10장을 1분 만에 만들기",
    ],
  },
  {
    number: 2,
    title: "AI 직원 고용하기 — CLAUDE.md의 마법",
    items: [
      "CLAUDE.md + me.md = 나만의 AI 직원 매뉴얼 작성",
      "skill 파일 만들기 — AI 직원에게 전문 능력 부여",
      "프롬프트의 기술: 나쁜 지시 vs 좋은 지시 비교 시연",
      "실습: 내 분야 맞춤형 AI 시스템 구축 (유형별 3트랙)",
      "트랙A: 유튜브 / 트랙B: 1인 창업 / 트랙C: 업무 자동화",
    ],
  },
  {
    number: 3,
    title: "바이브코딩 — 코딩 0%로 앱 만들기",
    items: [
      "클로드 코드 설치부터 첫 프로그램까지 (라이브 실습)",
      "실습: 자기소개 웹페이지 5분 만에 완성",
      "실습: 내 사업에 필요한 도구 직접 제작 (계산기, 생성기 등)",
      "에러 나면? 에러 메시지 그대로 클로드에게 보여주기",
      "웹인클로드로 경쟁사 분석 자율주행 리서치 체험",
    ],
  },
  {
    number: 4,
    title: "배포 + 확장 — 전 세계에 내 작품 공개",
    items: [
      "만든 걸 Vercel/Netlify로 무료 배포 (내 URL 생성)",
      "MCP 연결 맛보기 — AI 직원에게 인터넷 팔 달아주기",
      "혼자 갈 수 있는 로드맵 — skill 확장하는 법",
      "수익화 연결: 전자책·랜딩페이지·자동화 파이프라인",
      "수료 + 커뮤니티 안내 + 다음 단계 미리보기",
    ],
  },
];

/* 커리큘럼 섹션 컴포넌트 — 아코디언 형태로 4주차 내용 표시 */
export default function Curriculum() {
  /* 각 주차의 열림/닫힘 상태를 배열로 관리 */
  const [openState, setOpenState] = useState<boolean[]>([false, false, false, false]);

  /* 특정 주차 토글 핸들러 */
  const toggle = (index: number) => {
    setOpenState((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <section className="py-20 border-t border-[#E0DDD5]">
      <div className="max-w-[720px] mx-auto px-6">
        {/* 섹션 태그 뱃지 */}
        <span className="inline-block text-xs font-bold tracking-widest text-[#D4542B] bg-[#FFF0EB] px-3.5 py-1.5 rounded-full uppercase mb-5">
          커리큘럼
        </span>

        {/* 섹션 제목 — em 부분만 accent 색상 */}
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(26px,5vw,36px)] leading-[1.3] tracking-tight text-[#1A1A1A] mb-4">
          2시간 × 4회 = <em className="not-italic text-[#D4542B]">8시간 완성</em>
        </h2>

        {/* 섹션 부제목 + 상세 보기 링크 */}
        <div className="flex items-end justify-between mb-8">
          <p className="text-[#6B6B6B]">
            매 회차마다 &ldquo;우와!&rdquo; 하는 순간이 최소 3번은 나옵니다
          </p>
          <Link
            href="/curriculum"
            className="shrink-0 ml-4 text-[13px] font-bold text-[#D4542B] hover:underline"
          >
            자세히 보기 →
          </Link>
        </div>

        {/* 4주차 아코디언 리스트 — 각 카드에 ScrollReveal 스태거 적용 */}
        {weeks.map((week, idx) => (
          <ScrollReveal key={week.number} delay={idx * 0.1}>
            <div className="bg-white border border-[#E0DDD5] rounded-2xl mb-4 overflow-hidden">
              {/* 아코디언 헤더 — 클릭 시 열림/닫힘 토글 */}
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center gap-4 px-7 py-6 cursor-pointer select-none hover:bg-[#FAFAF7] transition-colors"
              >
                {/* 주차 번호 뱃지 — 아웃라인 스타일 (테두리만, 배경 투명) */}
                <div className="w-10 h-10 flex items-center justify-center font-[family-name:var(--font-display)] text-lg border-2 border-[#D4542B] text-[#D4542B] bg-transparent rounded-[10px] shrink-0">
                  {week.number}
                </div>

                {/* 주차 제목 */}
                <span className="text-[17px] font-bold flex-1 text-left">
                  {week.title}
                </span>

                {/* 토글 아이콘 — CaretDown 회전 애니메이션 */}
                <CaretDown
                  size={24}
                  weight="bold"
                  className={`text-[#6B6B6B] transition-transform duration-300 ${
                    openState[idx] ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* 아코디언 바디 — AnimatePresence로 부드러운 높이 전환 */}
              <AnimatePresence initial={false}>
                {openState[idx] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-7 pb-6">
                      <ul className="list-none">
                        {week.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[15px] text-[#6B6B6B] py-1.5"
                          >
                            {/* ArrowRight 아이콘 — 각 항목 앞에 인라인 표시 */}
                            <ArrowRight size={14} className="text-[#D4542B] shrink-0 mt-[5px]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
