/**
 * FooterCTA — 페이지 하단 최종 전환 유도 섹션 (서버 컴포넌트)
 * - 다크 배경 위에 희소성 카피 + CTA 버튼 배치
 * - #pricing 섹션으로 스크롤 이동하는 앵커 링크
 */
export default function FooterCTA() {
  return (
    <section className="bg-[#1A1A1A] py-20 text-center text-white">
      <div className="mx-auto max-w-[720px] px-6">
        {/* 메인 헤드라인 — 고민 중인 사용자에게 긴급성 전달 */}
        <h2
          className="mb-5 text-[clamp(26px,5vw,36px)] leading-[1.3] tracking-[-1px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          아직 고민 중이신가요?
        </h2>

        {/* 서브 카피 — 1기 마감 사실 + 2기 선착순 안내 */}
        <p
          className="mx-auto mb-9 max-w-[420px] text-[16px] leading-[1.8]"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          1기는 공지 3일 만에 마감됐습니다.
          <br />
          2기도 선착순 30명 마감됩니다.
        </p>

        {/* 소셜 프루프 — CTA 바로 위 신뢰 요소 */}
        <p
          className="mb-3 text-[0.85rem]"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          ⭐ 1기 수강생 만족도 4.9/5.0 · 수강생 전원 완주 · 100% 환불 보장
        </p>

        {/* CTA 버튼 — 클릭 시 #pricing 섹션으로 부드러운 스크롤 */}
        <a
          href="#pricing"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-none bg-[#D4542B] px-10 py-[18px] text-[17px] font-bold text-white transition-transform duration-200 hover:-translate-y-0.5"
          style={{ boxShadow: "0 4px 20px rgba(212,84,43,0.3)" }}
        >
          8시간 뒤, 나도 앱 만드는 사람 →
        </a>

        {/* CTA 서브카피 */}
        <p
          className="mt-2 text-[0.85rem]"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          1기 수강생 만족도 4.9/5.0 · 전원 완주
        </p>
      </div>
    </section>
  );
}
