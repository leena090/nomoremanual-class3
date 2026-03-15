import { NextResponse } from "next/server";
import { supabaseAdmin, isMockMode } from "@/lib/supabase";

/* ── GET: 잔여석 조회 API ── */
export async function GET() {
  try {
    /* Mock 모드: 고정 데이터 반환 */
    if (isMockMode) {
      return NextResponse.json({
        total: 30,
        enrolled: 3,
        remaining: 27,
      });
    }

    /* 실제 모드: 결제 완료된 신청자 수 카운트 */
    const { count, error } = await supabaseAdmin
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "completed");

    if (error) {
      console.error("잔여석 조회 오류:", error);
      return NextResponse.json(
        { message: "잔여석 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    /* 총 30석 기준 잔여석 계산 후 반환 */
    const enrolled = count || 0;
    return NextResponse.json({
      total: 30,
      enrolled,
      remaining: 30 - enrolled,
    });
  } catch (error) {
    /* 예상치 못한 에러 처리 */
    console.error("잔여석 API 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
