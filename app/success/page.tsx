"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

/**
 * 결제 성공 페이지 내부 컴포넌트
 * - URL 파라미터(orderId, paymentKey, amount)를 읽어 서버에 결제 승인 요청
 * - 성공/실패/로딩 3가지 상태 렌더링
 */
function SuccessContent() {
  const searchParams = useSearchParams();

  /* URL에서 결제 정보 추출 */
  const orderId = searchParams.get("orderId") || "";
  const paymentKey = searchParams.get("paymentKey") || "";
  const amount = Number(searchParams.get("amount")) || 0;

  /* 상태: loading / success / error */
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  /* 카카오 오픈챗 URL (환경변수에서 가져옴) */
  const openchatUrl = process.env.NEXT_PUBLIC_OPENCHAT_URL || "";

  useEffect(() => {
    /**
     * 결제 승인 API 호출
     * - orderId, paymentKey, amount를 서버로 전송
     * - 서버에서 토스 결제 승인 처리 후 DB 업데이트
     */
    const confirmPayment = async () => {
      try {
        const res = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, paymentKey, amount }),
        });
        const data = await res.json();

        if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(data.message || "결제 승인에 실패했습니다.");
        }
      } catch {
        setStatus("error");
        setErrorMessage("결제 승인 중 오류가 발생했습니다.");
      }
    };

    /* orderId가 있을 때만 승인 요청 */
    if (orderId) {
      confirmPayment();
    } else {
      setStatus("error");
      setErrorMessage("결제 정보가 없습니다.");
    }
  }, [orderId, paymentKey, amount]);

  /* ── 로딩 상태 ── */
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF7]">
        <div className="text-center">
          {/* 로딩 스피너 */}
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#E0DDD5] border-t-[#D4542B]" />
          <p className="text-[16px] text-[#6B6B6B]">결제를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  /* ── 에러 상태 ── */
  if (status === "error") {
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

          <h1
            className="mb-3 text-[24px] text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            결제 승인 실패
          </h1>
          <p className="mb-6 text-[15px] text-[#6B6B6B]">{errorMessage}</p>

          {/* 재시도 버튼 */}
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer rounded-xl border-none bg-[#D4542B] px-8 py-3 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  /* ── 성공 상태 ── */
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
          클로드 마스터클래스 2기에 오신 것을 환영합니다.
        </p>

        {/* 주문 정보 박스 */}
        <div className="mb-6 rounded-xl bg-[#FAFAF7] p-5 text-left">
          {/* 주문번호 */}
          <div className="mb-3 flex justify-between text-[14px]">
            <span className="text-[#6B6B6B]">주문번호</span>
            <span className="font-medium text-[#2D2D2D]">{orderId}</span>
          </div>
          {/* 결제 금액 — 천 단위 콤마 포맷 */}
          <div className="flex justify-between text-[14px]">
            <span className="text-[#6B6B6B]">결제 금액</span>
            <span className="font-bold text-[#D4542B]">
              {amount.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 카카오 오픈챗 링크 (환경변수 설정 시 노출) */}
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

        {/* 다음 단계 안내 */}
        <div className="mt-6 rounded-xl border border-[#E0DDD5] p-5 text-left">
          <h3 className="mb-3 text-[15px] font-bold text-[#2D2D2D]">
            다음 단계
          </h3>
          <ul className="space-y-2 text-[14px] text-[#6B6B6B]">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#2E7D32]">1.</span>
              <span>이메일로 수강 안내서가 발송됩니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#2E7D32]">2.</span>
              <span>카카오 오픈챗에 입장해주세요.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-[#2E7D32]">3.</span>
              <span>수업 전 사전 과제를 확인해주세요.</span>
            </li>
          </ul>
        </div>

        {/* 홈으로 돌아가기 */}
        <a
          href="/"
          className="mt-6 inline-block text-[14px] text-[#6B6B6B] underline transition-colors hover:text-[#2D2D2D]"
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}

/**
 * 결제 성공 페이지 (클라이언트 컴포넌트)
 * - useSearchParams를 Suspense로 감싸서 SSR 호환
 */
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
