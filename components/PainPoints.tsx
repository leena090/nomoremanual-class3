"use client";

/**
 * 페인 포인트(고충) 섹션 — 클라이언트 컴포넌트
 * - 타겟 고객의 공감을 이끌어내는 5가지 고충 항목
 * - Phosphor 듀오톤 아이콘 + 깔끔한 리스트 레이아웃
 * - StaggerReveal 스크롤 애니메이션 적용
 * - 카드 대신 아이콘 원형 + 텍스트 + 디바이더 구조
 */

import { Warning, Cpu, CurrencyCircleDollar, User, Buildings } from "@phosphor-icons/react";
import { StaggerReveal, StaggerItem } from "./ScrollReveal";
import { ComponentType } from "react";

/* Phosphor 아이콘 Props 타입 — weight와 size를 위한 인터페이스 */
interface IconProps {
  size?: number;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  className?: string;
}

/* 페인 포인트 데이터 배열 — 이모지 대신 Phosphor 아이콘 사용 */
const painPoints: { icon: ComponentType<IconProps>; title: string; desc: string }[] = [
  {
    icon: Warning,
    title: "클로드 Pro 결제했는데",
    desc: "대화만 하다 끝나요. 뭘 더 할 수 있는지 모르겠어요.",
  },
  {
    icon: Cpu,
    title: "코워크, 클로드 코드, MCP",
    desc: "다 좋다는데 뭐가 뭔지 도통 모르겠어요.",
  },
  {
    icon: CurrencyCircleDollar,
    title: "AI로 수익화",
    desc: "하고 싶은데 도대체 어디서부터 시작해야 하나요?",
  },
  {
    icon: User,
    title: "50대인데",
    desc: "유튜브나 블로그 보면서 따라해도 안 되고, 영어 에러 메시지 나오면 멘붕...",
  },
  {
    icon: Buildings,
    title: "내 사업에 필요한 홈페이지나 도구를",
    desc: "직접 만들고 싶은데, 개발자 고용할 돈이 없어요.",
  },
];

export default function PainPoints() {
  return (
    <section className="border-t border-[#E0DDD5] py-20 max-[600px]:py-[60px]">
      <div className="mx-auto max-w-[720px] px-6">
        {/* 섹션 태그 */}
        <span className="mb-5 inline-block rounded-full bg-[#FFF0EB] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[1px] text-[#D4542B]">
          이런 분들을 위한 강의입니다
        </span>

        {/* 섹션 제목 */}
        <h2
          className="mb-4 text-[clamp(26px,5vw,36px)] leading-[1.3] tracking-[-1px] text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          혹시 이런 상황이신가요?
        </h2>

        {/* 페인 포인트 리스트 — 카드 대신 아이콘 원형 + 텍스트 + 디바이더 */}
        <StaggerReveal className="mt-4 flex flex-col">
          {painPoints.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <StaggerItem
                key={idx}
                className={`flex items-start gap-5 py-6 ${
                  idx !== painPoints.length - 1 ? "border-b border-[#E0DDD5]" : ""
                }`}
              >
                {/* 아이콘 — 48px 원형 배경 위에 듀오톤 아이콘 */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF0EB]">
                  <IconComponent size={24} weight="duotone" className="text-[#D4542B]" />
                </div>

                {/* 텍스트 영역 — 굵은 제목 + 설명 */}
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
