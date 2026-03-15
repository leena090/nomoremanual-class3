/**
 * 솔루션 섹션 — 서버 컴포넌트
 * - 수업 후 할 수 있는 5가지를 카드로 보여줌
 * - 왼쪽 accent 보더(3px)로 페인 포인트 카드와 차별화
 * - 이모지 아이콘 + 굵은 제목 + 구체적 설명
 */

/* 솔루션 데이터 배열 — 레퍼런스 landing.html 기준 */
const solutions = [
  {
    icon: "⚡",
    title: "코워크로 엑셀·PPT 자동화",
    desc: '— "이 엑셀 파일 분석해서 보고서 만들어줘" 한마디면 끝',
  },
  {
    icon: "🛠️",
    title: "클로드 코드로 나만의 앱 제작",
    desc: "— 코딩 0% 지식으로 실제 작동하는 웹 도구 완성",
  },
  {
    icon: "🌐",
    title: "웹인클로드로 자율주행 리서치",
    desc: "— 쿠팡 소싱 조사, 경쟁사 분석을 AI가 알아서",
  },
  {
    icon: "📄",
    title: "나만의 AI 직원 매뉴얼(CLAUDE.md) 완성",
    desc: "— 내 사업에 맞춤형 AI 어시스턴트 세팅",
  },
  {
    icon: "🚀",
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
          8시간 수업 후,
          <br />
          여러분은 <span className="text-[#D4542B]">이걸 할 수 있습니다</span>
        </h2>

        {/* 솔루션 카드 목록 — 왼쪽 accent 보더 3px */}
        <div className="mt-8 flex flex-col gap-4">
          {solutions.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-[#E0DDD5] border-l-[3px] border-l-[#D4542B] bg-white py-7 pl-[60px] pr-7 text-[16px] leading-[1.7]"
            >
              {/* 이모지 아이콘 — 카드 왼쪽 고정 */}
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
