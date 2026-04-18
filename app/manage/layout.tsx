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

export const metadata: Metadata = {
  title: "솔바드 3기 수업관리 | NoMoreManual",
  description: "4회차 수업 게시판 · 과제 · 공지 · 확인 체크",
  robots: { index: false, follow: false },
};

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = `${gowunDodum.variable} ${nanumGothic.variable} ${jetbrainsMono.variable} ${notoSerifKR.variable}`;
  return <div className={fontVars}>{children}</div>;
}
