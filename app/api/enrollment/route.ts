import { NextResponse } from "next/server";
import { insertEnrollment, isMockMode } from "@/lib/db";
import { sendConfirmationEmail } from "@/lib/resend";
import { sendEnrollmentNotification } from "@/lib/notify";

/* ── POST: 솔바드 3기 수강 신청 접수 API ── */
export async function POST(request: Request) {
  try {
    /* 요청 바디 파싱 */
    const body = await request.json();
    const { name, email, phone, track, experience, goal } = body;

    /* 필수 필드 유효성 검사 */
    if (!name || !email || !phone || !track) {
      return NextResponse.json(
        { success: false, message: "필수 항목을 모두 입력해주세요." },
        { status: 400 }
      );
    }

    /* 주문번호 생성: SB3-타임스탬프-랜덤문자열 (솔바드 3기) */
    const orderId = `SB3-${Date.now()}-${Math.random()
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

    /* ── 실제 모드: Neon Postgres DB에 신청 데이터 삽입 ── */
    const result = await insertEnrollment({
      name,
      email,
      phone,
      track,
      experience: experience || null,
      goal: goal || null,
      order_id: orderId,
      amount: 285000,
      cohort: 3,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "신청 접수에 실패했습니다." },
        { status: 500 }
      );
    }

    /* 신청 확인 이메일 발송 (도메인 인증 후 작동) */
    try {
      await sendConfirmationEmail({
        name,
        email,
        orderId,
        amount: 285000,
        track,
      });
    } catch (emailError) {
      console.error("이메일 발송 실패 (신청은 정상 처리됨):", emailError);
    }

    /* 텔레그램으로 대표님에게 신청 알림 전송 */
    try {
      await sendEnrollmentNotification({ name, email, phone, track, orderId });
    } catch (notifyError) {
      console.error("텔레그램 알림 실패:", notifyError);
    }

    /* 성공 응답 반환 */
    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error("신청 API 오류:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
