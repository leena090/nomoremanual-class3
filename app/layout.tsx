import type { Metadata } from "next";
import { Black_Han_Sans, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

/* 디스플레이 폰트: 제목/헤드라인용 */
const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/* 본문 폰트: Noto Sans KR */
const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/* SEO 메타데이터 */
export const metadata: Metadata = {
  title: "노모어매뉴얼 | 클로드 마스터클래스 2기 — 선착순 30명 모집",
  description:
    "코딩 1도 모르는 50대가 클로드로 앱을 만들었습니다. 코워크, 클로드 코드, 웹 활용까지 8시간 만에 AI 직원 한 명 고용하는 법.",
  openGraph: {
    title: "노모어매뉴얼 | 클로드 마스터클래스 2기",
    description: "8시간 만에 AI 직원 한 명 고용하는 법 — 선착순 30명",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${blackHanSans.variable} ${notoSansKR.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
