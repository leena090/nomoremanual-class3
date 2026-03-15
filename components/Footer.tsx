/**
 * Footer — 사업자 정보 및 저작권 표시 (서버 컴포넌트)
 * - 베이지 배경, 작은 텍스트로 법적 필수 정보 노출
 */
export default function Footer() {
  return (
    <footer className="bg-[#F0EDE5] py-10 text-center">
      <div className="mx-auto max-w-[720px] px-6 text-[13px] leading-[2] text-[#6B6B6B]">
        {/* 회사명 */}
        <p>노모어매뉴얼 AI주식회사</p>

        {/* 대표자 및 사업자등록번호 */}
        <p>대표: 이PD · 사업자등록번호: 000-00-00000</p>

        {/* 통신판매업 신고번호 */}
        <p>통신판매업 신고번호: 제0000-서울강남-00000호</p>

        {/* 문의 채널 */}
        <p>문의: 카카오톡 채널 @nomoremanual</p>

        {/* 저작권 표시 */}
        <p className="mt-2">© 2026 노모어매뉴얼. All rights reserved.</p>
      </div>
    </footer>
  );
}
