"use client";

import { useState } from "react";

// FAQ 항목 데이터 타입
interface FAQItem {
  question: string; // 질문
  answer: string; // 답변
}

// FAQ 데이터 — landing.html 원본 텍스트 그대로
const faqData: FAQItem[] = [
  {
    question: "코딩을 전혀 몰라도 따라갈 수 있나요?",
    answer:
      "네, 강사 본인도 코딩을 모릅니다. 1기 수강생 대부분이 50~70대였고 전원 완주했어요. 한국어로 지시만 하면 되기 때문에 코딩 지식은 0%여도 됩니다.",
  },
  {
    question: "클로드 Pro 구독이 필요한가요?",
    answer:
      "Pro 구독($20/월)을 권장합니다. 무료 버전으로도 일부 실습은 가능하지만, 코워크와 클로드 코드를 충분히 활용하려면 Pro가 필요합니다.",
  },
  {
    question: "수업 방식은 어떤가요? (온라인? 오프라인?)",
    answer:
      "Zoom 온라인 라이브 수업입니다. 화면 공유하면서 같이 실습하고, 막히면 즉시 도와드립니다. 녹화본도 제공되니 복습도 가능해요.",
  },
  {
    question: "Windows와 Mac 모두 가능한가요?",
    answer:
      "네, 둘 다 가능합니다. 수업 중 Windows/Mac 각각의 명령어와 설치법을 모두 안내해 드립니다.",
  },
  {
    question: "환불 정책은 어떻게 되나요?",
    answer:
      "1회차 수업 후 만족스럽지 않으시면 전액 환불해 드립니다. 이유를 묻지 않습니다. 2회차 이후에는 잔여 회차 비율로 환불 가능합니다.",
  },
  {
    question: "1기랑 뭐가 달라요?",
    answer:
      "1기 피드백을 100% 반영했습니다. 코워크 실무 자동화 실습 강화, 웹인클로드 리서치 체험 추가, 유형별 맞춤 트랙 세분화, 사전 세팅 가이드 배포로 수업 시간을 더 알차게 구성했습니다.",
  },
];

// FAQ 섹션 컴포넌트 — 질문 클릭 시 답변 토글
export default function FAQ() {
  // 각 FAQ 항목의 열림/닫힘 상태 관리 (6개 항목)
  const [openState, setOpenState] = useState<boolean[]>(
    new Array(faqData.length).fill(false)
  );

  // 특정 항목 토글 핸들러
  const toggle = (index: number) => {
    setOpenState((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <section className="py-20 border-t border-[#E0DDD5]">
      <div className="max-w-[720px] mx-auto px-6">
        {/* 섹션 태그 뱃지 */}
        <span className="inline-block text-xs font-bold tracking-widest text-[#D4542B] bg-[#FFF0EB] px-3.5 py-1.5 rounded-full uppercase mb-5">
          자주 묻는 질문
        </span>

        {/* 섹션 제목 */}
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(26px,5vw,36px)] leading-[1.3] tracking-tight text-[#1A1A1A] mb-4">
          궁금한 점이 있으신가요?
        </h2>

        {/* FAQ 리스트 */}
        <div className="mt-6">
          {faqData.map((item, idx) => (
            <div key={idx} className="border-b border-[#E0DDD5] py-6">
              {/* 질문 행 — 클릭으로 토글, 좌우 flex 배치 */}
              <button
                onClick={() => toggle(idx)}
                className="w-full text-base font-bold cursor-pointer flex justify-between items-center select-none text-left bg-transparent border-none p-0 text-[#2D2D2D] min-h-[48px]"
              >
                <span>{item.question}</span>
                {/* 토글 아이콘 (+/−) */}
                <span className="text-xl text-[#6B6B6B] ml-4 shrink-0">
                  {openState[idx] ? "−" : "+"}
                </span>
              </button>

              {/* 답변 영역 — 열린 상태에서만 표시 */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out text-[15px] text-[#6B6B6B] leading-[1.8] ${
                  openState[idx] ? "max-h-[300px] pt-4" : "max-h-0"
                }`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
