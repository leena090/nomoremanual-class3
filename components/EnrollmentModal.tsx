"use client";

import { useState, type FormEvent } from "react";
import type { EnrollmentFormData } from "@/types/enrollment";

/**
 * EnrollmentModal — 수강 신청 모달 (클라이언트 컴포넌트)
 * - 오버레이 + 모달 카드 구조
 * - 폼 검증 → API 호출 → 토스페이먼츠 결제 또는 목업 리다이렉트
 */
interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* 전화번호 검증 패턴: 010-1234-5678 또는 01012345678 허용 */
const PHONE_REGEX = /^010-?\d{4}-?\d{4}$/;

export default function EnrollmentModal({
  isOpen,
  onClose,
}: EnrollmentModalProps) {
  /* ── 폼 상태 관리 ── */
  const [formData, setFormData] = useState<EnrollmentFormData>({
    name: "",
    email: "",
    phone: "",
    track: "youtube",
    experience: undefined,
    goal: "",
  });

  /* 필드별 에러 메시지 */
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* 제출 로딩 상태 */
  const [isLoading, setIsLoading] = useState(false);

  /* 모달이 닫혀있으면 렌더링 스킵 */
  if (!isOpen) return null;

  /**
   * 폼 검증 — 모든 필수 필드 확인
   * @returns 에러가 없으면 true
   */
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    /* 이름 필수 */
    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    }

    /* 이메일 필수 + 형식 */
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    /* 전화번호 필수 + 010 패턴 */
    if (!formData.phone.trim()) {
      newErrors.phone = "전화번호를 입력해주세요.";
    } else if (!PHONE_REGEX.test(formData.phone)) {
      newErrors.phone = "010-0000-0000 형식으로 입력해주세요.";
    }

    /* 관심 트랙 필수 */
    if (!formData.track) {
      newErrors.track = "관심 트랙을 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 폼 제출 핸들러
   * 1. 검증 → 2. API 호출 → 3. 결제 SDK or mock 리다이렉트
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    /* 검증 실패 시 리턴 */
    if (!validate()) return;

    setIsLoading(true);

    try {
      /* 신청 API 호출 */
      const res = await fetch("/api/enrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!data.success) {
        setErrors({ submit: data.message || "신청에 실패했습니다." });
        return;
      }

      const orderId = data.orderId;
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

      /* 토스 클라이언트 키가 설정되어 있고 더미가 아닌 경우 → 실제 결제 */
      if (clientKey && clientKey !== "your-client-key") {
        /* TossPayments SDK 동적 로드 */
        const { loadTossPayments } = await import("@tosspayments/tosspayments-sdk");
        const tossPayments = await loadTossPayments(clientKey);
        const payment = tossPayments.payment({ customerKey: orderId });

        /* 카드 결제 요청 */
        await payment.requestPayment({
          method: "CARD",
          amount: { currency: "KRW", value: 385000 },
          orderId,
          orderName: "클로드 마스터클래스 2기",
          successUrl: `${window.location.origin}/success`,
          failUrl: `${window.location.origin}/fail`,
        });
      } else {
        /* 목업 모드 — 성공 페이지로 바로 이동 */
        alert("신청이 완료되었습니다! (테스트 모드)");
        window.location.href = `/success?orderId=MOCK&paymentKey=MOCK&amount=385000`;
      }
    } catch (err) {
      console.error("신청 처리 중 오류:", err);
      setErrors({ submit: "신청 처리 중 오류가 발생했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* 오버레이 — 클릭 시 모달 닫기 */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      {/* 모달 카드 — 이벤트 전파 차단으로 내부 클릭 시 닫힘 방지 */}
      <div
        className="mx-4 w-full max-w-md overflow-y-auto rounded-2xl bg-white"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 헤더 ── */}
        <div className="flex items-center justify-between border-b border-[#E0DDD5] px-6 py-5">
          <h2
            className="text-[20px] font-bold text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            클로드 마스터클래스 2기 신청
          </h2>
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-[20px] text-[#6B6B6B] transition-colors hover:bg-[#F5E6D3]"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* ── 폼 영역 ── */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {/* 이름 */}
          <div>
            <label className="mb-1.5 block text-[14px] font-medium text-[#2D2D2D]">
              이름 <span className="text-[#D4542B]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg border border-[#E0DDD5] bg-white px-4 py-3 text-[15px] text-[#2D2D2D] outline-none transition-colors focus:border-[#D4542B]"
              placeholder="홍길동"
            />
            {errors.name && (
              <p className="mt-1 text-[13px] text-red-500">{errors.name}</p>
            )}
          </div>

          {/* 이메일 */}
          <div>
            <label className="mb-1.5 block text-[14px] font-medium text-[#2D2D2D]">
              이메일 <span className="text-[#D4542B]">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-lg border border-[#E0DDD5] bg-white px-4 py-3 text-[15px] text-[#2D2D2D] outline-none transition-colors focus:border-[#D4542B]"
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-[13px] text-red-500">{errors.email}</p>
            )}
          </div>

          {/* 전화번호 */}
          <div>
            <label className="mb-1.5 block text-[14px] font-medium text-[#2D2D2D]">
              전화번호 <span className="text-[#D4542B]">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full rounded-lg border border-[#E0DDD5] bg-white px-4 py-3 text-[15px] text-[#2D2D2D] outline-none transition-colors focus:border-[#D4542B]"
              placeholder="010-0000-0000"
            />
            {errors.phone && (
              <p className="mt-1 text-[13px] text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* 관심 트랙 */}
          <div>
            <label className="mb-1.5 block text-[14px] font-medium text-[#2D2D2D]">
              관심 트랙 <span className="text-[#D4542B]">*</span>
            </label>
            <select
              required
              value={formData.track}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  track: e.target.value as EnrollmentFormData["track"],
                })
              }
              className="w-full rounded-lg border border-[#E0DDD5] bg-white px-4 py-3 text-[15px] text-[#2D2D2D] outline-none transition-colors focus:border-[#D4542B]"
            >
              <option value="youtube">유튜브 크리에이터</option>
              <option value="startup">1인 창업</option>
              <option value="automation">업무 자동화</option>
            </select>
            {errors.track && (
              <p className="mt-1 text-[13px] text-red-500">{errors.track}</p>
            )}
          </div>

          {/* 클로드 사용 경험 (선택) */}
          <div>
            <label className="mb-1.5 block text-[14px] font-medium text-[#2D2D2D]">
              클로드 사용 경험
            </label>
            <select
              value={formData.experience || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experience: (e.target.value || undefined) as
                    | EnrollmentFormData["experience"]
                    | undefined,
                })
              }
              className="w-full rounded-lg border border-[#E0DDD5] bg-white px-4 py-3 text-[15px] text-[#2D2D2D] outline-none transition-colors focus:border-[#D4542B]"
            >
              <option value="">선택해주세요</option>
              <option value="beginner">처음 써봐요</option>
              <option value="intermediate">좀 써봤어요</option>
              <option value="advanced">많이 써봤어요</option>
            </select>
          </div>

          {/* 수강 목표 (선택, 최대 200자) */}
          <div>
            <label className="mb-1.5 block text-[14px] font-medium text-[#2D2D2D]">
              수강 목표
            </label>
            <textarea
              value={formData.goal || ""}
              onChange={(e) => {
                /* 200자 제한 */
                if (e.target.value.length <= 200) {
                  setFormData({ ...formData, goal: e.target.value });
                }
              }}
              className="w-full resize-none rounded-lg border border-[#E0DDD5] bg-white px-4 py-3 text-[15px] text-[#2D2D2D] outline-none transition-colors focus:border-[#D4542B]"
              rows={3}
              placeholder="이 강의를 통해 이루고 싶은 목표를 적어주세요"
            />
            {/* 글자 수 카운터 */}
            <p className="mt-1 text-right text-[12px] text-[#6B6B6B]">
              {(formData.goal || "").length}/200
            </p>
          </div>

          {/* 서버 에러 메시지 */}
          {errors.submit && (
            <p className="text-center text-[14px] text-red-500">
              {errors.submit}
            </p>
          )}

          {/* 결제 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-xl border-none bg-[#D4542B] py-[14px] text-[17px] font-bold text-white transition-opacity duration-200 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ minHeight: "48px" }}
          >
            {isLoading ? "처리 중..." : "385,000원 결제하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
