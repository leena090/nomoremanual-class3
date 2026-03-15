"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

/**
 * 결제 실패 페이지 내부 컴포넌트
 * - URL 파라미터에서 에러 코드와 메시지를 읽어 표시
 */
function FailContent() {
  const searchParams = useSearchParams();

  /* URL에서 에러 정보 추출 */
  const code = searchParams.get("code") || "UNKNOWN";
  const message = searchParams.get("message") || "알 수 없는 오류가 발생했습니다.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        {/* 빨간 X 아이콘 */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* 실패 메시지 */}
        <h1
          className="mb-3 text-[28px] text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          결제에 실패했습니다
        </h1>

        {/* 에러 상세 정보 박스 */}
        <div className="mb-6 rounded-xl bg-[#FAFAF7] p-5 text-left">
          {/* 에러 코드 */}
          <div className="mb-3 flex justify-between text-[14px]">
            <span className="text-[#6B6B6B]">에러 코드</span>
            <span className="font-mono text-[13px] font-medium text-[#2D2D2D]">
              {code}
            </span>
          </div>
          {/* 에러 메시지 */}
          <div className="text-[14px]">
            <span className="text-[#6B6B6B]">상세 내용</span>
            <p className="mt-1 text-[#2D2D2D]">{message}</p>
          </div>
        </div>

        {/* 다시 시도 버튼 — 메인 페이지로 이동 */}
        <a
          href="/"
          className="inline-block w-full cursor-pointer rounded-xl border-none bg-[#D4542B] px-8 py-3 text-center text-[15px] font-bold text-white transition-opacity hover:opacity-90"
        >
          다시 시도하기
        </a>

        {/* 문의 안내 */}
        <p className="mt-4 text-[13px] text-[#6B6B6B]">
          문제가 계속되면 카카오톡 @nomoremanual로 문의해주세요.
        </p>
      </div>
    </div>
  );
}

/**
 * 결제 실패 페이지 (클라이언트 컴포넌트)
 * - useSearchParams를 Suspense로 감싸서 SSR 호환
 */
export default function FailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7]">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#E0DDD5] border-t-[#D4542B]" />
        </div>
      }
    >
      <FailContent />
    </Suspense>
  );
}
