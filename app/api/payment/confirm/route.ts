import { NextResponse } from "next/server";
import { sql, isMockMode, updatePaymentStatus } from "@/lib/db";
import { confirmPayment } from "@/lib/toss";
import { sendConfirmationEmail } from "@/lib/resend";

/* ── POST: 토스페이먼츠 결제 승인 API ── */
export async function POST(request: Request) {
  try {
    /* 요청 바디 파싱 */
    const body = await request.json();
    const { orderId, paymentKey, amount } = body;

    /* 필수 필드 유효성 검사 */
    if (!orderId || !paymentKey || !amount) {
      return NextResponse.json(
        { success: false, message: "결제 정보가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    /* 토스페이먼츠 결제 승인 호출 */
    const tossResult = await confirmPayment(paymentKey, orderId, amount);

    /* ── Mock 모드 ── */
    if (isMockMode) {
      console.log("[MOCK] 결제 승인 완료:", { orderId, paymentKey, amount });
      return NextResponse.json({
        success: true,
        orderId,
        message: "결제가 완료되었습니다.",
      });
    }

    /* ── 실제 모드: DB에서 해당 주문 조회 ── */
    if (!sql) {
      return NextResponse.json(
        { success: false, message: "DB 연결 오류" },
        { status: 500 }
      );
    }

    const rows = await sql`
      SELECT * FROM enrollments WHERE order_id = ${orderId} LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "주문 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const enrollment = rows[0];

    /* 결제 상태 업데이트 */
    await updatePaymentStatus(
      orderId,
      "completed",
      paymentKey,
      tossResult.method || "카드"
    );

    /* 결제 완료 확인 이메일 발송 */
    try {
      await sendConfirmationEmail({
        name: enrollment.name,
        email: enrollment.email,
        orderId,
        amount,
        track: enrollment.track || "youtube",
      });
    } catch (emailError) {
      console.error("이메일 발송 실패 (결제는 정상 처리됨):", emailError);
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: "결제가 완료되었습니다.",
    });
  } catch (error) {
    console.error("결제 승인 API 오류:", error);
    const message =
      error instanceof Error ? error.message : "결제 승인에 실패했습니다.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
