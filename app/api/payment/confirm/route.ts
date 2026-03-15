import { NextResponse } from "next/server";
import { supabaseAdmin, isMockMode } from "@/lib/supabase";
import { confirmPayment } from "@/lib/toss";
import { sendConfirmationEmail } from "@/lib/resend";

/* ── POST: 토스페이먼츠 결제 승인 API ── */
export async function POST(request: Request) {
  try {
    /* 요청 바디 파싱 */
    const body = await request.json();
    const { orderId, paymentKey, amount } = body;

    /* 필수 필드 유효성 검사 (주문번호, 결제키, 금액) */
    if (!orderId || !paymentKey || !amount) {
      return NextResponse.json(
        { success: false, message: "결제 정보가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    /* 토스페이먼츠 결제 승인 호출 */
    const tossResult = await confirmPayment(paymentKey, orderId, amount);

    /* ── Mock 모드: DB 업데이트 생략, 로그만 출력 ── */
    if (isMockMode) {
      console.log("[MOCK] 결제 승인 완료:", {
        orderId,
        paymentKey,
        amount,
        method: tossResult.method,
      });

      /* Mock 모드에서도 이메일 발송 시도 (resend도 mock이면 로그만 출력) */
      await sendConfirmationEmail({
        name: "테스트",
        email: "test@example.com",
        orderId,
        amount,
        track: "youtube",
      });

      return NextResponse.json({
        success: true,
        orderId,
        message: "결제가 완료되었습니다.",
      });
    }

    /* ── 실제 모드: DB에서 해당 주문 조회 ── */
    const { data: enrollment, error: fetchError } = await supabaseAdmin
      .from("enrollments")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (fetchError || !enrollment) {
      console.error("주문 조회 오류:", fetchError);
      return NextResponse.json(
        { success: false, message: "주문 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    /* 결제 상태 업데이트: payment_status, payment_key, paid_at, payment_method */
    const { error: updateError } = await supabaseAdmin
      .from("enrollments")
      .update({
        payment_status: "completed",
        payment_key: paymentKey,
        paid_at: new Date().toISOString(),
        payment_method: tossResult.method || "카드",
        amount,
      })
      .eq("order_id", orderId);

    if (updateError) {
      console.error("결제 상태 업데이트 오류:", updateError);
      return NextResponse.json(
        { success: false, message: "결제 상태 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }

    /* 결제 완료 확인 이메일 발송 */
    await sendConfirmationEmail({
      name: enrollment.name,
      email: enrollment.email,
      orderId,
      amount,
      track: enrollment.track || "youtube",
    });

    /* 성공 응답 반환 */
    return NextResponse.json({
      success: true,
      orderId,
      message: "결제가 완료되었습니다.",
    });
  } catch (error) {
    /* 결제 승인 실패 또는 예상치 못한 에러 처리 */
    console.error("결제 승인 API 오류:", error);
    const message =
      error instanceof Error
        ? error.message
        : "결제 승인에 실패했습니다.";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
