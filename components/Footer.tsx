/**
 * Footer — 사업자 정보 및 저작권 표시 (서버 컴포넌트)
 * - 베이지 배경, 작은 텍스트로 법적 필수 정보 노출
 */
export default function Footer() {
  return (
    <footer className="bg-[#F0EDE5] py-10 text-center">
      <div className="mx-auto max-w-[720px] px-6 text-[13px] leading-[2] text-[#6B6B6B]">
        {/* 회사명 */}
        <p>솔바드 · 노모어매뉴얼</p>

        {/* 대표자 및 사업자등록번호 */}
        <p>대표: 이PD · 사업자등록번호: 000-00-00000</p>

        {/* 통신판매업 신고번호 */}
        <p>통신판매업 신고번호: 제0000-서울강남-00000호</p>

        {/* 문의 채널 */}
        <p>문의: 카카오톡 채널 @nomoremanual</p>

        {/* 외부 링크 — 유튜브 + 카카오 채널 */}
        <div className="mt-4 flex items-center justify-center gap-5">
          {/* 유튜브 채널 링크 */}
          <a
            href="https://www.youtube.com/@nomoremanual"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 text-[#6B6B6B] hover:text-[#D4542B] transition-colors"
            aria-label="노모어매뉴얼 유튜브 채널"
          >
            {/* YouTube SVG 아이콘 */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="text-[12px]">유튜브</span>
          </a>

          {/* 카카오톡 채널 링크 */}
          <a
            href="https://pf.kakao.com/_nomoremanual"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 text-[#6B6B6B] hover:text-[#D4542B] transition-colors"
            aria-label="노모어매뉴얼 카카오톡 채널"
          >
            {/* 카카오톡 SVG 아이콘 */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.72 1.794 5.108 4.493 6.451-.177.632-.64 2.29-.734 2.647-.114.438.16.432.337.314.14-.093 2.23-1.516 3.13-2.129.249.024.504.036.774.036 5.523 0 10-3.463 10-7.319C22 6.463 17.523 3 12 3z"/>
            </svg>
            <span className="text-[12px]">카카오톡</span>
          </a>
        </div>

        {/* 저작권 표시 */}
        <p className="mt-4">© 2026 솔바드. All rights reserved.</p>
      </div>
    </footer>
  );
}
