// 수강생 후기 섹션 — 서버 컴포넌트 (상태 관리 불필요)

// 후기 데이터 타입 정의
interface Review {
  text: string; // 후기 본문
  author: string; // 작성자 정보
}

// 1기 수강생 후기 데이터 — landing.html 원본 텍스트 그대로
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

// 후기 섹션 컴포넌트 — 따뜻한 배경색 위에 카드 3장
export default function Reviews() {
  return (
    <section className="py-20 bg-[#F5E6D3]">
      <div className="max-w-[720px] mx-auto px-6">
        {/* 섹션 태그 뱃지 */}
        <span className="inline-block text-xs font-bold tracking-widest text-[#D4542B] bg-[#FFF0EB] px-3.5 py-1.5 rounded-full uppercase mb-5">
          1기 수강생 후기
        </span>

        {/* 섹션 제목 — "솔직한 이야기" 부분만 accent 색상 */}
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(26px,5vw,36px)] leading-[1.3] tracking-tight text-[#1A1A1A] mb-4">
          직접 들으신 분들의 <em className="not-italic text-[#D4542B]">솔직한 이야기</em>
        </h2>

        {/* 후기 카드 목록 */}
        <div className="mt-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E0DDD5] rounded-2xl p-7 mb-4"
            >
              {/* 별점 5개 (골드 색상) */}
              <div className="text-[#F5C36A] text-base mb-3 tracking-widest">
                ★★★★★
              </div>

              {/* 후기 본문 */}
              <div className="text-[15px] leading-[1.8] text-[#2D2D2D] mb-4">
                {review.text}
              </div>

              {/* 작성자 정보 */}
              <div className="text-[13px] text-[#6B6B6B]">
                {review.author}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
