import { NextResponse } from "next/server";
import { supabaseAdmin, isMockMode } from "@/lib/supabase";
import type { Enrollment } from "@/types/enrollment";

/* ── Mock 데이터: CSV 내보내기 테스트용 ── */
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

/* CSV 값 이스케이프: 쉼표·줄바꿈·따옴표가 포함된 경우 따옴표로 감싸기 */
function escapeCsvValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  /* 쉼표, 줄바꿈, 따옴표가 있으면 따옴표로 감싸고 내부 따옴표는 이중 따옴표로 */
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/* ── GET: CSV 파일 다운로드 API ── */
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

    let enrollments: Enrollment[];

    /* ── Mock 모드: 더미 데이터 사용 ── */
    if (isMockMode) {
      enrollments = MOCK_ENROLLMENTS;
    } else {
      /* ── 실제 모드: Supabase에서 전체 신청자 조회 ── */
      const { data, error } = await supabaseAdmin
        .from("enrollments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("CSV 내보내기 데이터 조회 오류:", error);
        return NextResponse.json(
          { success: false, message: "데이터 조회에 실패했습니다." },
          { status: 500 }
        );
      }

      enrollments = data || [];
    }

    /* CSV 헤더 행 (한국어 — Excel 호환) */
    const headers = [
      "이름",
      "이메일",
      "전화번호",
      "트랙",
      "경험",
      "목표",
      "주문번호",
      "결제상태",
      "결제금액",
      "결제방법",
      "결제일시",
      "신청일시",
    ];

    /* CSV 데이터 행 생성 */
    const rows = enrollments.map((e) =>
      [
        escapeCsvValue(e.name),
        escapeCsvValue(e.email),
        escapeCsvValue(e.phone),
        escapeCsvValue(e.track),
        escapeCsvValue(e.experience),
        escapeCsvValue(e.goal),
        escapeCsvValue(e.order_id),
        escapeCsvValue(e.payment_status),
        escapeCsvValue(e.amount),
        escapeCsvValue(e.payment_method),
        escapeCsvValue(e.paid_at),
        escapeCsvValue(e.created_at),
      ].join(",")
    );

    /* UTF-8 BOM + 헤더 + 데이터를 합쳐서 CSV 문자열 생성 */
    /* BOM(\uFEFF)은 한국어 Excel에서 UTF-8 인코딩을 올바르게 인식하기 위해 필요 */
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");

    /* CSV 파일 응답 반환 (다운로드 트리거) */
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="enrollments.csv"',
      },
    });
  } catch (error) {
    /* 예상치 못한 에러 처리 */
    console.error("CSV 내보내기 API 오류:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
