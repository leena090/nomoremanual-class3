import { NextResponse } from "next/server";
import { getCompletedCount, isMockMode } from "@/lib/db";

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
    const enrolled = await getCompletedCount();

    /* 총 30석 기준 잔여석 계산 후 반환 */
    return NextResponse.json({
      total: 30,
      enrolled,
      remaining: 30 - enrolled,
    });
  } catch (error) {
    console.error("잔여석 API 오류:", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
