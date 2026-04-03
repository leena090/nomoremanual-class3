/* ── 텔레그램 알림 발송 (신청 접수 시 대표님에게 알림) ── */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

/* 트랙명 한글 변환 */
const TRACK_LABEL: Record<string, string> = {
  youtube: "유튜브 크리에이터",
  startup: "1인 창업",
  automation: "업무 자동화",
};

/* 신청 접수 알림 전송 */
export async function sendEnrollmentNotification(params: {
  name: string;
  email: string;
  phone: string;
  track: string;
  orderId: string;
}) {
  /* 텔레그램 미설정 시 스킵 */
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log("[SKIP] 텔레그램 미설정, 알림 생략:", params.name);
    return;
  }

  const { name, email, phone, track, orderId } = params;
  const trackLabel = TRACK_LABEL[track] || track;

  /* 알림 메시지 구성 */
  const message = [
    `🔔 *솔바드 3기 새 신청!*`,
    ``,
    `👤 이름: ${name}`,
    `📧 이메일: ${email}`,
    `📱 전화: ${phone}`,
    `📚 트랙: ${trackLabel}`,
    `🔖 주문번호: \`${orderId}\``,
    ``,
    `💰 결제 대기 중 (285,000원)`,
  ].join("\n");

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!res.ok) {
      console.error("텔레그램 알림 실패:", await res.text());
    }
  } catch (error) {
    console.error("텔레그램 알림 오류:", error);
  }
}
