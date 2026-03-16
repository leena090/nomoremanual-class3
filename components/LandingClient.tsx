"use client";

import { useState } from "react";

/* ── 섹션 컴포넌트 임포트 ── */
import Hero from "./Hero";
import PainPoints from "./PainPoints";
import Solution from "./Solution";
import Instructor from "./Instructor";
import Curriculum from "./Curriculum";
import Reviews from "./Reviews";
import Pricing from "./Pricing";
import Guarantee from "./Guarantee";
import FAQ from "./FAQ";
import FooterCTA from "./FooterCTA";
import Footer from "./Footer";
import StickyCTA from "./StickyCTA";
import ExitIntentPopup from "./ExitIntentPopup";
import EnrollmentModal from "./EnrollmentModal";
import CloverPopup from "./CloverPopup";

/**
 * LandingClient — 랜딩 페이지 전체를 감싸는 클라이언트 래퍼
 * - 모달 open/close 상태를 중앙에서 관리
 * - 모든 섹션을 순서대로 렌더링
 */
export default function LandingClient() {
  /* 수강 신청 모달 열림/닫힘 상태 */
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* 모달 열기 핸들러 */
  const openModal = () => setIsModalOpen(true);

  /* 모달 닫기 핸들러 */
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="pb-[100px]">
      {/* 히어로 섹션 — CTA 클릭 시 모달 오픈 */}
      <Hero onOpenModal={openModal} />

      {/* 페인포인트 — 고객 문제 공감 */}
      <PainPoints />

      {/* 솔루션 — 문제 해결 방법 제시 */}
      <Solution />

      {/* 강사 소개 */}
      <Instructor />

      {/* 커리큘럼 상세 */}
      <Curriculum />

      {/* 수강생 후기 */}
      <Reviews />

      {/* 가격 + 신청 — id로 FooterCTA 등에서 스크롤 타겟 */}
      <div id="pricing">
        <Pricing onOpenModal={openModal} />
      </div>

      {/* 환불 보장 */}
      <Guarantee />

      {/* 자주 묻는 질문 */}
      <FAQ />

      {/* 하단 CTA 섹션 */}
      <FooterCTA />

      {/* 푸터 — 사업자 정보 */}
      <Footer />

      {/* 하단 고정 CTA (모바일 + 데스크톱) */}
      <StickyCTA onOpenModal={openModal} />

      {/* 이탈 감지 팝업 */}
      <ExitIntentPopup onOpenModal={openModal} />

      {/* 네잎클로버 행운 팝업 */}
      <CloverPopup onOpenModal={openModal} />

      {/* 수강 신청 모달 */}
      <EnrollmentModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
