import type { ReactNode } from "react";

/* ── URL 자동 감지 정규식 ──
   http(s)://... 또는 www.로 시작하는 링크를 토큰화.
*/
const URL_RE =
  /(?:https?:\/\/|www\.)[-A-Z0-9+&@#/%?=~_|!:,.;()]*[-A-Z0-9+&@#/%=~_|()]/gi;

/* ── 줄바꿈 유지 + URL을 <a>로 자동 변환 ──
   post__body에 그대로 쓸 수 있음. white-space: pre-wrap 덕분에 개행 보존.
*/
export function LinkifiedText({ text }: { text: string }): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  /* 매 호출마다 lastIndex 초기화 (전역 플래그 정규식 재사용) */
  URL_RE.lastIndex = 0;

  while ((match = URL_RE.exec(text)) !== null) {
    const url = match[0];
    const start = match.index;

    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }

    /* www.* 로 시작하면 https 프리픽스 추가 */
    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    parts.push(
      <a
        key={`lnk-${keyCounter++}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="post__link"
      >
        {url}
      </a>
    );

    lastIndex = start + url.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}
