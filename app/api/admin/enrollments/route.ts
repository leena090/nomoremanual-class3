import { NextResponse } from "next/server";
import { supabaseAdmin, isMockMode } from "@/lib/supabase";
import type { Enrollment, PaymentStatus } from "@/types/enrollment";

/* ── Mock 데이터: DB 없을 때 테스트용 더미 신청자 3명 ── */
const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    id: "mock-1",
    created_at: "2026-03-10T09:00:00Z",
    name: "김테스트",
    email: "kim@example.com",
    phone: "010-1234-5678",
    track: "youtube",
    experience: "beginner",
    goal: "유튜브 자동화",
    order_id: "NMM2-1710000001-ab12",
    payment_key: "toss_pk_mock_1",
    amount: 390000,
    payment_status: "completed",
    payment_method: "카드",
    paid_at: "2026-03-10T09:05:00Z",
    cohort: 2,
    notes: null,
  },
  {
    id: "mock-2",
    created_at: "2026-03-11T14:30:00Z",
    name: "이개발",
    email: "lee@example.com",
    phone: "010-9876-5432",
    track: "startup",
    experience: "intermediate",
    goal: "스타트업 MVP 빠르게 만들기",
    order_id: "NMM2-1710000002-cd34",
    payment_key: null,
    amount: 390000,
    payment_status: "pending",
    payment_method: null,
    paid_at: null,
    cohort: 2,
    notes: null,
  },
  {
    id: "mock-3",
    created_at: "2026-03-12T11:00:00Z",
    name: "박자동",
    email: "park@example.com",
    phone: "010-5555-1234",
    track: "automation",
    experience: "advanced",
    goal: "업무 자동화 파이프라인 구축",
    order_id: "NMM2-1710000003-ef56",
    payment_key: "toss_pk_mock_3",
    amount: 390000,
    payment_status: "completed",
    payment_method: "간편결제",
    paid_at: "2026-03-12T11:10:00Z",
    cohort: 2,
    notes: null,
  },
];

/* ── GET: 관리자 신청자 목록 조회 API ── */
export async function GET(request: Request) {
  try {
    /* x-admin-key 헤더로 관리자 인증 확인 */
    const adminKey = request.headers.get("x-admin-key");
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminKey || adminKey !== adminPassword) {
      return NextResponse.json(
        { success: false, message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    /* URL 쿼리 파라미터에서 결제 상태 필터 추출 */
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status") as PaymentStatus | null;

    /* ── Mock 모드: 더미 데이터 반환 ── */
    if (isMockMode) {
      let filtered = MOCK_ENROLLMENTS;

      /* 상태 필터가 있으면 해당 상태만 반환 */
      if (statusFilter) {
        filtered = MOCK_ENROLLMENTS.filter(
          (e) => e.payment_status === statusFilter
        );
      }

      return NextResponse.json({ enrollments: filtered });
    }

    /* ── 실제 모드: Supabase에서 신청자 목록 조회 ── */
    let query = supabaseAdmin
      .from("enrollments")
      .select("*")
      .order("created_at", { ascending: false });

    /* 상태 필터가 있으면 조건 추가 */
    if (statusFilter) {
      query = query.eq("payment_status", statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("신청자 목록 조회 오류:", error);
      return NextResponse.json(
        { success: false, message: "신청자 목록 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    /* 신청자 목록 반환 */
    return NextResponse.json({ enrollments: data || [] });
  } catch (error) {
    /* 예상치 못한 에러 처리 */
    console.error("관리자 신청자 목록 API 오류:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
