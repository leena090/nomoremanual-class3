/**
 * 강사 소개 섹션 — 서버 컴포넌트
 * - 따뜻한 배경(warm) 박스 안에 아바타 + 소개 정보
 * - 모바일에서 세로 정렬, 데스크톱에서 가로 정렬
 * - 인용문(quote)은 accent 컬러로 강조
 */

export default function Instructor() {
  return (
    <section className="border-t border-[#E0DDD5] py-20 max-[600px]:py-[60px]">
      <div className="mx-auto max-w-[720px] px-6">
        {/* 섹션 태그 */}
        <span className="mb-5 inline-block rounded-full bg-[#FFF0EB] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[1px] text-[#D4542B]">
          강사 소개
        </span>

        {/* 섹션 제목 */}
        <h2
          className="mb-4 text-[clamp(26px,5vw,36px)] leading-[1.3] tracking-[-1px] text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          노모어매뉴얼 대표
        </h2>

        {/* 강사 소개 박스 — warm 배경, 모바일: 세로 중앙 / 데스크톱: 가로 */}
        <div className="mt-6 flex gap-7 rounded-2xl bg-[#F5E6D3] p-8 max-[600px]:flex-col max-[600px]:items-center max-[600px]:text-center">
          {/* 아바타 — 원형 배경에 이모지 */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#E8D5C0] text-[32px]">
            👩‍🏫
          </div>

          {/* 강사 정보 */}
          <div>
            {/* 이름/직함 */}
            <h3 className="mb-2 text-lg font-bold text-[#1A1A1A]">
              20년 교육 경력의 AI 오케스트라 지휘자
            </h3>

            {/* 약력 */}
            <p className="text-sm leading-[1.7] text-[#6B6B6B]">
              영어 입시 교육 20년 → AI 교육 전환
              <br />
              유튜브 구독자 1만명 (노모어매뉴얼 채널)
              <br />
              클로드 코워크·코드·웹 실전 활용 전문
              <br />
              클로드코드 1기 강의 전원 완주, 만족도 4.9/5.0
            </p>

            {/* 인용문 — accent 컬러, 굵게 */}
            <p className="mt-4 text-sm font-bold text-[#D4542B]">
              &ldquo;저도 코딩 몰라요. 그래서 여러분 눈높이를 정확히
              압니다.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
