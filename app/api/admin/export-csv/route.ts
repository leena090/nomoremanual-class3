import { NextResponse } from "next/server";
import { getEnrollments, isMockMode } from "@/lib/db";
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
];

/* CSV 값 이스케이프 */
function escapeCsvValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
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

    if (isMockMode) {
      enrollments = MOCK_ENROLLMENTS;
    } else {
      /* Neon Postgres에서 전체 신청자 조회 */
      enrollments = (await getEnrollments()) as Enrollment[];
    }

    /* CSV 헤더 행 */
    const headers = [
      "이름", "이메일", "전화번호", "트랙", "경험", "목표",
      "주문번호", "결제상태", "결제금액", "결제방법", "결제일시", "신청일시",
    ];

    /* CSV 데이터 행 생성 */
    const rows = enrollments.map((e) =>
      [
        escapeCsvValue(e.name), escapeCsvValue(e.email), escapeCsvValue(e.phone),
        escapeCsvValue(e.track), escapeCsvValue(e.experience), escapeCsvValue(e.goal),
        escapeCsvValue(e.order_id), escapeCsvValue(e.payment_status),
        escapeCsvValue(e.amount), escapeCsvValue(e.payment_method),
        escapeCsvValue(e.paid_at), escapeCsvValue(e.created_at),
      ].join(",")
    );

    /* UTF-8 BOM + CSV 문자열 생성 */
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="enrollments.csv"',
      },
    });
  } catch (error) {
    console.error("CSV 내보내기 API 오류:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
