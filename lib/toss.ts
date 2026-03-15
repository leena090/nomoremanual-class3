/* ── 토스페이먼츠 관련 유틸리티 ── */

/* 클라이언트 키 (프론트엔드 결제 위젯용) */
export const TOSS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

/* 시크릿 키 (서버측 결제 승인용) */
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || "";

/* Mock 모드 여부 */
export const isTossMockMode =
  !TOSS_CLIENT_KEY || TOSS_CLIENT_KEY === "your-client-key";

/* 결제 승인 API 호출 (서버 사이드 전용) */
export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
) {
  /* Mock 모드: 바로 성공 반환 */
  if (!TOSS_SECRET_KEY || TOSS_SECRET_KEY === "your-secret-key") {
    console.log("[MOCK] 토스 결제 승인:", { paymentKey, orderId, amount });
    return {
      paymentKey,
      orderId,
      totalAmount: amount,
      method: "카드",
      status: "DONE",
    };
  }

  /* 실제 토스페이먼츠 승인 API 호출 */
  const encryptedSecretKey =
    "Basic " + Buffer.from(TOSS_SECRET_KEY + ":").toString("base64");

  const response = await fetch(
    "https://api.tosspayments.com/v1/payments/confirm",
    {
      method: "POST",
      headers: {
        Authorization: encryptedSecretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "결제 승인에 실패했습니다.");
  }

  return response.json();
}
