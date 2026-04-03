import { Resend } from "resend";
import { getEmailTemplate } from "./email-template";

/* ── Resend 클라이언트 초기화 ── */
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
/* 도메인 미인증 시 Resend 기본 발신 주소 사용 */
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

/* Mock 모드 여부 */
const isMockMode =
  !RESEND_API_KEY || RESEND_API_KEY === "your-resend-api-key";

const resend = isMockMode ? null : new Resend(RESEND_API_KEY);

/* 결제 완료 확인 이메일 발송 */
export async function sendConfirmationEmail(params: {
  name: string;
  email: string;
  orderId: string;
  amount: number;
  track: string;
}) {
  const { name, email, orderId, amount, track } = params;
  const openchatUrl = process.env.NEXT_PUBLIC_OPENCHAT_URL || "#";

  /* Mock 모드: 콘솔에 로그만 출력 */
  if (isMockMode || !resend) {
    console.log("[MOCK] 이메일 발송:", { to: email, name, orderId, amount });
    return { success: true, mock: true };
  }

  /* 실제 이메일 발송 */
  const { data, error } = await resend.emails.send({
    from: RESEND_FROM,
    to: email,
    subject: "[솔바드] 클로드 마스터클래스 3기 수강 신청이 완료되었습니다",
    html: getEmailTemplate({ name, orderId, amount, track, openchatUrl }),
  });

  if (error) {
    console.error("이메일 발송 실패:", error);
    return { success: false, error };
  }

  return { success: true, data };
}
