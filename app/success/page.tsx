"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

/**
 * 신청 완료 페이지 — 솔바드 3기
 * - 신청 완료 확인 + 결제 안내 (현금이체/카드결제)
 * - 토스페이먼츠 결제 승인 없이 단순 확인 페이지
 */
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  /* 카카오 오픈챗 URL (환경변수에서 가져옴) */
  const openchatUrl = process.env.NEXT_PUBLIC_OPENCHAT_URL || "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        {/* 초록 체크 아이콘 */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <svg
            className="h-8 w-8 text-[#2E7D32]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* 성공 메시지 */}
        <h1
          className="mb-3 text-[28px] text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          신청이 완료되었습니다!
        </h1>
        <p className="mb-6 text-[15px] text-[#6B6B6B]">
          솔바드 3기에 오신 것을 환영합니다.
        </p>

        {/* 신청 정보 */}
        {orderId && (
          <div className="mb-6 rounded-xl bg-[#FAFAF7] p-5 text-left">
            <div className="mb-3 flex justify-between text-[14px]">
              <span className="text-[#6B6B6B]">신청번호</span>
              <span className="font-medium text-[#2D2D2D]">{orderId}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[#6B6B6B]">수강료</span>
              <span className="font-bold text-[#D4542B]">285,000원</span>
            </div>
          </div>
        )}

        {/* 결제 안내 */}
        <div className="mb-6 rounded-xl border border-[#E0DDD5] p-5 text-left">
          <h3 className="mb-3 text-[15px] font-bold text-[#2D2D2D]">
            결제 안내
          </h3>
          <p className="text-[14px] text-[#6B6B6B] leading-[1.8]">
            이메일로 결제 방법 안내가 발송되었습니다.
            <br />
            <strong className="text-[#2D2D2D]">현금이체</strong> 또는 <strong className="text-[#2D2D2D]">카드결제</strong> 중
            <br />
            편한 방법으로 결제해주세요.
          </p>
          <p className="mt-2 text-[13px] text-[#6B6B6B]">
            현금영수증 발행 가능합니다.
          </p>
        </div>

        {/* 다음 단계 */}
        <div className="mb-6 rounded-xl border border-[#E0DDD5] p-5 text-left">
          <h3 className="mb-3 text-[15px] font-bold text-[#2D2D2D]">
            다음 단계
          </h3>
          <ul className="space-y-2 text-[14px] text-[#6B6B6B]">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#2E7D32]">1.</span>
              <span>이메일로 결제 안내서가 발송됩니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#2E7D32]">2.</span>
              <span>결제 완료 후 수강 안내 메일을 보내드립니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#2E7D32]">3.</span>
              <span>1회차(4/17 금 21:30) 전까지 클로드 Pro 구독을 준비해주세요.</span>
            </li>
          </ul>
        </div>

        {/* 카카오 오픈챗 링크 */}
        {openchatUrl && (
          <a
            href={openchatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-block w-full rounded-xl bg-[#FEE500] px-8 py-3 text-[15px] font-bold text-[#1A1A1A] transition-opacity hover:opacity-90"
          >
            카카오 오픈챗 입장하기
          </a>
        )}

        {/* 문의 안내 */}
        <p className="mt-4 text-[13px] text-[#6B6B6B]">
          궁금한 점은 카카오톡 @nomoremanual로 문의해주세요.
        </p>

        {/* 홈으로 */}
        <a
          href="/"
          className="mt-4 inline-block text-[14px] text-[#6B6B6B] underline transition-colors hover:text-[#2D2D2D]"
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7]">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#E0DDD5] border-t-[#D4542B]" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
