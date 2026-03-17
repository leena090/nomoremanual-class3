"use client";

/**
 * 솔루션 섹션 — 클라이언트 컴포넌트
 * - 수업 후 할 수 있는 5가지를 번호 매긴 리스트로 표시
 * - Phosphor 듀오톤 아이콘 + 큰 번호(01-05) 레이아웃
 * - 카드 대신 디바이더로 구분하는 깔끔한 구조
 * - StaggerReveal 스크롤 애니메이션 적용
 */

import { Lightning, Wrench, Globe, FileText, Rocket } from "@phosphor-icons/react";
import { StaggerReveal, StaggerItem } from "./ScrollReveal";
import { ComponentType } from "react";

/* Phosphor 아이콘 Props 타입 */
interface IconProps {
  size?: number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  className?: string;
}

/* 솔루션 데이터 배열 — 이모지 대신 Phosphor 아이콘 사용 */
const solutions: { icon: ComponentType<IconProps>; title: string; desc: string }[] = [
  {
    icon: Lightning,
    title: "코워크로 엑셀·PPT 자동화",
    desc: '— "이 엑셀 파일 분석해서 보고서 만들어줘" 한마디면 끝',
  },
  {
    icon: Wrench,
    title: "클로드 코드로 나만의 앱 제작",
    desc: "— 코딩 0% 지식으로 실제 작동하는 웹 도구 완성",
  },
  {
    icon: Globe,
    title: "웹인클로드로 자율주행 리서치",
    desc: "— 쿠팡 소싱 조사, 경쟁사 분석을 AI가 알아서",
  },
  {
    icon: FileText,
    title: "나만의 AI 직원 매뉴얼(CLAUDE.md) 완성",
    desc: "— 내 사업에 맞춤형 AI 어시스턴트 세팅",
  },
  {
    icon: Rocket,
    title: "만든 걸 인터넷에 배포",
    desc: "— 내 URL로 전 세계에 공개, 명함에 넣을 수 있는 내 홈페이지",
  },
];

export default function Solution() {
  return (
    <section className="border-t border-[#E0DDD5] py-20 max-[600px]:py-[60px]">
      <div className="mx-auto max-w-[720px] px-6">
        {/* 섹션 태그 */}
        <span className="mb-5 inline-block rounded-full bg-[#FFF0EB] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[1px] text-[#D4542B]">
          해결책
        </span>

        {/* 섹션 제목 — "이걸 할 수 있습니다"를 accent 컬러로 강조 */}
        <h2
          className="mb-4 text-[clamp(26px,5vw,36px)] leading-[1.3] tracking-[-1px] text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          10시간 수업 후,
          <br />
          여러분은 <span className="text-[#D4542B]">이걸 할 수 있습니다</span>
        </h2>

        {/* 솔루션 리스트 — 번호 + 아이콘 + 텍스트, 디바이더로 구분 */}
        <StaggerReveal className="mt-8 flex flex-col">
          {solutions.map((item, idx) => {
            const IconComponent = item.icon;
            /* 번호 포맷: 01, 02, 03... */
            const number = String(idx + 1).padStart(2, "0");
            return (
              <StaggerItem
                key={idx}
                className={`flex items-start gap-5 py-6 ${
                  idx !== solutions.length - 1 ? "border-b border-[#E0DDD5]" : ""
                }`}
              >
                {/* 왼쪽: 큰 번호 (반투명) + 아이콘 */}
                <div className="flex shrink-0 items-center gap-3">
                  {/* 번호 — accent 색상 30% 투명도로 큰 글씨 */}
                  <span
                    className="text-[28px] font-bold leading-none text-[#D4542B]/30"
                    style={{ fontFamily: "var(--font-accent)" }}
                  >
                    {number}
                  </span>
                  {/* 아이콘 — 듀오톤 스타일 */}
                  <IconComponent size={24} weight="duotone" className="text-[#D4542B]" />
                </div>

                {/* 오른쪽: 제목 + 설명 텍스트 */}
                <div className="text-[16px] leading-[1.7]">
                  <strong className="text-[#1A1A1A]">{item.title}</strong>{" "}
                  {item.desc}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerReveal>
      </div>
    </section>
  );
}
