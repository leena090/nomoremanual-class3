import { NextResponse } from "next/server";
import { supabaseAdmin, isMockMode } from "@/lib/supabase";

/* ── POST: 수강 신청 접수 API ── */
export async function POST(request: Request) {
  try {
    /* 요청 바디 파싱 */
    const body = await request.json();
    const { name, email, phone, track, experience, goal } = body;

    /* 필수 필드 유효성 검사 (이름, 이메일, 전화번호, 트랙) */
    if (!name || !email || !phone || !track) {
      return NextResponse.json(
        { success: false, message: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    /* 주문번호 생성: NMM2-타임스탬프-랜덤문자열 형식 */
    const orderId = `NMM2-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 6)}`;

    /* ── Mock 모드: DB 없이 콘솔 로그만 출력 ── */
    if (isMockMode) {
      console.log("[MOCK] 수강 신청 접수:", {
        name,
        email,
        phone,
        track,
        experience,
        goal,
        orderId,
      });
      return NextResponse.json({ success: true, orderId });
    }

    /* ── 실제 모드: 잔여석 확인 (최대 30명) ── */
    const { count, error: countError } = await supabaseAdmin
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("payment_status", "completed");

    if (countError) {
      console.error("잔여석 조회 오류:", countError);
      return NextResponse.json(
        { success: false, message: "잔여석 조회에 실패했습니다." },
        { status: 500 }
      );
    }

    /* 잔여석이 0이면 마감 처리 */
    const enrolled = count || 0;
    if (enrolled >= 30) {
      return NextResponse.json(
        { success: false, message: "죄송합니다. 모집이 마감되었습니다." },
        { status: 400 }
      );
    }

    /* ── 실제 모드: DB에 신청 데이터 삽입 ── */
    const { error: insertError } = await supabaseAdmin
      .from("enrollments")
      .insert({
        name,
        email,
        phone,
        track,
        experience: experience || null,
        goal: goal || null,
        order_id: orderId,
        amount: 0, // 결제 전이므로 0
        payment_status: "pending",
        cohort: 2, // 2기
      });

    if (insertError) {
      console.error("신청 데이터 삽입 오류:", insertError);
      return NextResponse.json(
        { success: false, message: "신청 접수에 실패했습니다." },
        { status: 500 }
      );
    }

    /* 성공 응답 반환 */
    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    /* 예상치 못한 에러 처리 */
    console.error("신청 API 오류:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
