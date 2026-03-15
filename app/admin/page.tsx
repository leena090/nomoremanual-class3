"use client";

import { useState, useEffect, useCallback } from "react";
import type { Enrollment, PaymentStatus } from "@/types/enrollment";

/* ── 결제 상태별 배지 스타일 매핑 ── */
const STATUS_BADGE: Record<
  PaymentStatus,
  { label: string; bg: string; text: string }
> = {
  completed: { label: "완료", bg: "bg-green-100", text: "text-green-800" },
  pending: { label: "대기", bg: "bg-yellow-100", text: "text-yellow-800" },
  failed: { label: "실패", bg: "bg-red-100", text: "text-red-800" },
  refunded: { label: "환불", bg: "bg-gray-100", text: "text-gray-600" },
};

/* ── 필터 탭 목록 정의 ── */
const FILTER_TABS: { label: string; value: PaymentStatus | "all" }[] = [
  { label: "전체", value: "all" },
  { label: "완료", value: "completed" },
  { label: "대기", value: "pending" },
  { label: "실패", value: "failed" },
];

/* ── 금액을 한국 원화 형식으로 포맷 ── */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount) + "원";
}

/* ── 날짜를 한국 형식으로 포맷 ── */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  /* ── 상태 관리 ── */
  const [authenticated, setAuthenticated] = useState(false); // 인증 여부
  const [password, setPassword] = useState(""); // 비밀번호 입력값
  const [loginError, setLoginError] = useState(""); // 로그인 에러 메시지
  const [loginLoading, setLoginLoading] = useState(false); // 로그인 로딩 상태
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]); // 신청자 목록
  const [filter, setFilter] = useState<PaymentStatus | "all">("all"); // 현재 필터
  const [loading, setLoading] = useState(false); // 데이터 로딩 상태

  /* ── 신청자 목록 조회 함수 ── */
  const fetchEnrollments = useCallback(
    async (statusFilter: PaymentStatus | "all") => {
      setLoading(true);
      try {
        /* sessionStorage에서 관리자 키 가져오기 */
        const adminKey = sessionStorage.getItem("adminKey") || "";

        /* 필터가 "all"이 아니면 쿼리 파라미터로 상태 전달 */
        const url =
          statusFilter === "all"
            ? "/api/admin/enrollments"
            : `/api/admin/enrollments?status=${statusFilter}`;

        const res = await fetch(url, {
          headers: { "x-admin-key": adminKey },
        });

        if (!res.ok) {
          /* 401이면 인증 만료 처리 */
          if (res.status === 401) {
            setAuthenticated(false);
            sessionStorage.removeItem("adminKey");
          }
          return;
        }

        const data = await res.json();
        setEnrollments(data.enrollments || []);
      } catch (error) {
        console.error("신청자 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* ── 로그인 처리 ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        /* 인증 성공: sessionStorage에 키 저장 후 대시보드 표시 */
        sessionStorage.setItem("adminKey", password);
        setAuthenticated(true);
        setPassword("");
      } else {
        /* 인증 실패: 에러 메시지 표시 */
        setLoginError(data.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setLoginError("서버 오류가 발생했습니다.");
    } finally {
      setLoginLoading(false);
    }
  };

  /* ── 인증 성공 시 신청자 목록 자동 조회 ── */
  useEffect(() => {
    if (authenticated) {
      fetchEnrollments(filter);
    }
  }, [authenticated, filter, fetchEnrollments]);

  /* ── 페이지 로드 시 sessionStorage에 저장된 키로 자동 인증 확인 ── */
  useEffect(() => {
    const savedKey = sessionStorage.getItem("adminKey");
    if (savedKey) {
      /* 저장된 키가 있으면 인증 상태로 전환 */
      setAuthenticated(true);
    }
  }, []);

  /* ── CSV 다운로드 처리 ── */
  const handleExportCsv = async () => {
    try {
      const adminKey = sessionStorage.getItem("adminKey") || "";
      const res = await fetch("/api/admin/export-csv", {
        headers: { "x-admin-key": adminKey },
      });

      if (!res.ok) {
        alert("CSV 다운로드에 실패했습니다.");
        return;
      }

      /* Blob으로 변환 후 다운로드 트리거 */
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "enrollments.csv";
      document.body.appendChild(a);
      a.click();
      /* 정리: DOM에서 링크 제거 및 URL 해제 */
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV 내보내기 실패:", error);
      alert("CSV 다운로드 중 오류가 발생했습니다.");
    }
  };

  /* ── 통계 계산 (완료된 신청자 기준) ── */
  const completedEnrollments = enrollments.filter(
    (e) => e.payment_status === "completed"
  );
  /* 총 매출: 완료된 신청의 금액 합계 */
  const totalRevenue = completedEnrollments.reduce(
    (sum, e) => sum + (e.amount || 0),
    0
  );

  /* ═══════════════════════════════════════════ */
  /* ── 로그인 화면: 인증 전 ── */
  /* ═══════════════════════════════════════════ */
  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FAFAF7" }}
      >
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          {/* 로그인 제목 */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
            관리자 로그인
          </h1>

          <form onSubmit={handleLogin}>
            {/* 비밀번호 입력 필드 */}
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 mb-4"
              autoFocus
            />

            {/* 에러 메시지 표시 */}
            {loginError && (
              <p className="text-red-500 text-sm mb-4">{loginError}</p>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loginLoading || !password}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loginLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════ */
  /* ── 관리자 대시보드: 인증 후 ── */
  /* ═══════════════════════════════════════════ */
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ── 헤더 영역 ── */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            관리자 대시보드
          </h1>
          {/* 로그아웃 버튼 */}
          <button
            onClick={() => {
              sessionStorage.removeItem("adminKey");
              setAuthenticated(false);
              setEnrollments([]);
            }}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            로그아웃
          </button>
        </div>

        {/* ── 요약 카드 3개 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* 총 신청자 수 카드 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">총 신청자</p>
            <p className="text-3xl font-bold text-gray-900">
              {enrollments.length}
              <span className="text-base font-normal text-gray-400 ml-1">
                명
              </span>
            </p>
          </div>

          {/* 총 매출 카드 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">총 매출</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalRevenue)}
            </p>
          </div>

          {/* 잔여석 카드 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">잔여석</p>
            <p className="text-3xl font-bold text-gray-900">
              {30 - completedEnrollments.length}
              <span className="text-base font-normal text-gray-400 ml-1">
                / 30
              </span>
            </p>
          </div>
        </div>

        {/* ── 필터 탭 + CSV 다운로드 ── */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === tab.value
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* CSV 내보내기 버튼 */}
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            CSV 다운로드
          </button>
        </div>

        {/* ── 신청자 테이블 ── */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            /* 로딩 상태 표시 */
            <div className="p-12 text-center text-gray-400">
              불러오는 중...
            </div>
          ) : enrollments.length === 0 ? (
            /* 데이터 없음 표시 */
            <div className="p-12 text-center text-gray-400">
              신청자가 없습니다.
            </div>
          ) : (
            /* 반응형 테이블 (가로 스크롤 지원) */
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                {/* 테이블 헤더 */}
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      이름
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      이메일
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      전화번호
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      트랙
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      결제상태
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">
                      금액
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">
                      결제일
                    </th>
                  </tr>
                </thead>

                {/* 테이블 바디: 신청자 행 렌더링 */}
                <tbody>
                  {enrollments.map((enrollment) => {
                    /* 결제 상태에 따른 배지 스타일 결정 */
                    const badge =
                      STATUS_BADGE[enrollment.payment_status] ||
                      STATUS_BADGE.pending;

                    return (
                      <tr
                        key={enrollment.id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        {/* 이름 */}
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {enrollment.name}
                        </td>
                        {/* 이메일 */}
                        <td className="px-4 py-3 text-gray-600">
                          {enrollment.email}
                        </td>
                        {/* 전화번호 */}
                        <td className="px-4 py-3 text-gray-600">
                          {enrollment.phone}
                        </td>
                        {/* 트랙 */}
                        <td className="px-4 py-3 text-gray-600">
                          {enrollment.track || "-"}
                        </td>
                        {/* 결제 상태 배지 */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        {/* 결제 금액 (우측 정렬) */}
                        <td className="px-4 py-3 text-right text-gray-900">
                          {formatCurrency(enrollment.amount)}
                        </td>
                        {/* 결제일시 */}
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {formatDate(enrollment.paid_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
