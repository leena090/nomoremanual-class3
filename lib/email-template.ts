/* ── 결제 완료 이메일 HTML 템플릿 ── */

interface EmailTemplateParams {
  name: string;
  orderId: string;
  amount: number;
  track: string;
  openchatUrl: string;
}

/* 트랙 한글 변환 */
const trackLabels: Record<string, string> = {
  youtube: "유튜브 크리에이터",
  startup: "1인 창업",
  automation: "업무 자동화",
};

export function getEmailTemplate(params: EmailTemplateParams): string {
  const { name, orderId, amount, track, openchatUrl } = params;
  const trackLabel = trackLabels[track] || track;
  const formattedAmount = amount.toLocaleString("ko-KR");

  return `
<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#FAFAF7;font-family:'Noto Sans KR',sans-serif;color:#2D2D2D;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <!-- 헤더 -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-size:24px;color:#1A1A1A;margin:0;">노모어매뉴얼</h1>
      <p style="font-size:14px;color:#6B6B6B;margin-top:4px;">클로드 마스터클래스 2기</p>
    </div>

    <!-- 본문 -->
    <div style="background:#FFFFFF;border-radius:16px;padding:32px;border:1px solid #E0DDD5;">
      <h2 style="font-size:20px;color:#1A1A1A;margin:0 0 16px;">${name}님, 환영합니다!</h2>
      <p style="line-height:1.8;">클로드 마스터클래스 2기 신청이 완료되었습니다.</p>

      <!-- 주문 정보 -->
      <div style="background:#FAFAF7;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 8px;"><strong>■ 주문번호:</strong> ${orderId}</p>
        <p style="margin:0 0 8px;"><strong>■ 결제금액:</strong> ${formattedAmount}원</p>
        <p style="margin:0;"><strong>■ 선택 트랙:</strong> ${trackLabel}</p>
      </div>

      <!-- 다음 단계 -->
      <h3 style="font-size:16px;color:#1A1A1A;margin:24px 0 12px;">■ 다음 단계:</h3>
      <ol style="padding-left:20px;line-height:2;">
        <li>사전 세팅 가이드를 이메일로 보내드립니다 (2일 내)</li>
        <li>수강생 전용 카카오톡 오픈채팅에 입장해주세요:
          <a href="${openchatUrl}" style="color:#D4542B;">${openchatUrl}</a>
        </li>
        <li>1회차 수업 전까지 클로드 Pro 구독을 준비해주세요</li>
      </ol>

      <p style="margin-top:24px;color:#6B6B6B;font-size:14px;">
        궁금한 점은 카카오톡 @nomoremanual로 문의해주세요.
      </p>
    </div>

    <!-- 푸터 -->
    <div style="text-align:center;margin-top:32px;font-size:12px;color:#6B6B6B;">
      <p>감사합니다.<br>노모어매뉴얼 드림</p>
      <p style="margin-top:16px;">&copy; 2026 NOMOREMANUAL AI Corporation</p>
    </div>
  </div>
</body>
</html>`;
}
