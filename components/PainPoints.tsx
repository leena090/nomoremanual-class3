/**
 * 페인 포인트(고충) 섹션 — 서버 컴포넌트
 * - 타겟 고객의 공감을 이끌어내는 5가지 고충 카드
 * - 이모지 아이콘 + 굵은 제목 + 설명 구조
 * - 50대+ 타겟이므로 카드당 충분한 패딩과 큰 글씨
 */

/* 페인 포인트 데이터 배열 — 레퍼런스 landing.html 기준 */
const painPoints = [
  {
    icon: "😓",
    title: "클로드 Pro 결제했는데",
    desc: "대화만 하다 끝나요. 뭘 더 할 수 있는지 모르겠어요.",
  },
  {
    icon: "🤯",
    title: "코워크, 클로드 코드, MCP",
    desc: "다 좋다는데 뭐가 뭔지 도통 모르겠어요.",
  },
  {
    icon: "💸",
    title: "AI로 수익화",
    desc: "하고 싶은데 도대체 어디서부터 시작해야 하나요?",
  },
  {
    icon: "👴",
    title: "50대인데",
    desc: "유튜브나 블로그 보면서 따라해도 안 되고, 영어 에러 메시지 나오면 멘붕...",
  },
  {
    icon: "🏗️",
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

        {/* 페인 포인트 카드 목록 */}
        <div className="mt-4 flex flex-col gap-4">
          {painPoints.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-[#E0DDD5] bg-white py-7 pl-[60px] pr-7 text-[16px] leading-[1.7]"
            >
              {/* 이모지 아이콘 — 카드 왼쪽 고정 위치 */}
              <span className="absolute left-5 top-[26px] text-2xl">
                {item.icon}
              </span>
              {/* 카드 본문: 굵은 제목 + 설명 */}
              <strong className="text-[#1A1A1A]">{item.title}</strong>{" "}
              {item.desc}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
