import type { Metadata } from "next";
import {
  Gowun_Dodum,
  Nanum_Gothic,
  JetBrains_Mono,
  Noto_Serif_KR,
} from "next/font/google";
import "./manage.css";

/* ── 프로토타입 폰트 스택 재현 ── */
const gowunDodum = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  variable: "--manage-font-heading",
  display: "swap",
});

const nanumGothic = Nanum_Gothic({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--manage-font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--manage-font-mono",
  display: "swap",
});

const notoSerifKR = Noto_Serif_KR({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--manage-font-serif",
  display: "swap",
});

/* ── /manage 전용 메타 (공유 시 깔끔한 카드) ──
   root layout의 랜딩 OG/Twitter 메타를 전부 덮어씀.
*/
export const metadata: Metadata = {
  title: "솔바드 3기 수업관리 전용앱",
  description: "수업 게시판 · 과제 · 공지 · 확인 체크",
  robots: { index: false, follow: false },
  openGraph: {
    title: "솔바드 3기 수업관리 전용앱",
    description: "수업 게시판 · 과제 · 공지 · 확인 체크",
    type: "website",
    url: "https://nomoremanual-class3.vercel.app/manage",
    siteName: "솔바드",
    locale: "ko_KR",
    /* 랜딩 OG 이미지 사용 안 함 — 텍스트 카드로 깔끔하게 */
    images: [],
  },
  twitter: {
    card: "summary",
    title: "솔바드 3기 수업관리 전용앱",
    description: "수업 게시판 · 과제 · 공지 · 확인 체크",
    images: [],
  },
};

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = `${gowunDodum.variable} ${nanumGothic.variable} ${jetbrainsMono.variable} ${notoSerifKR.variable}`;
  return <div className={fontVars}>{children}</div>;
}
