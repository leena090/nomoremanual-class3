import type { Metadata } from "next";
import { Black_Han_Sans, Noto_Sans_KR, Outfit } from "next/font/google";
import "./globals.css";

/* 디스플레이 폰트: 제목/헤드라인용 */
const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/* 액센트 폰트: 숫자/영문 전용 (Outfit) */
const outfit = Outfit({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
});

/* 본문 폰트: Noto Sans KR */
const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/* SEO 메타데이터 — 전환율 + 검색 최적화 */
export const metadata: Metadata = {
  metadataBase: new URL("https://nomoremanual-class2.vercel.app"),
  title: "클로드 마스터클래스 2기 | 코딩 모르는 50대도 10시간 만에 1인창업 성공",
  description:
    "1기 만족도 4.9/5.0, 수강생 전원 완주. 코워크·클로드 코드·웹 활용까지 10시간 만에 AI 직원 한 명 고용하세요. 선착순 30명, 100% 환불 보장.",
  keywords: [
    "클로드 마스터클래스",
    "Claude 강의",
    "AI 업무 자동화",
    "노코드 앱 만들기",
    "클로드 코드",
    "코워크",
    "50대 코딩",
    "AI 직원",
    "노모어매뉴얼",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://nomoremanual-class2.vercel.app",
  },
  openGraph: {
    title: "클로드 마스터클래스 2기 | 10시간 만에 1인창업 성공하는 법",
    description:
      "코딩 1도 모르는 50대가 클로드로 앱을 만들었습니다. 1기 만족도 4.9, 전원 완주. 선착순 30명 모집 중.",
    type: "website",
    url: "https://nomoremanual-class2.vercel.app",
    siteName: "노모어매뉴얼",
    locale: "ko_KR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "클로드 마스터클래스 2기 — 10시간 만에 1인창업 성공하는 법",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "클로드 마스터클래스 2기 | 코딩 모르는 50대도 1인창업 성공",
    description:
      "1기 만족도 4.9/5.0, 전원 완주. 10시간 만에 AI 직원 한 명 고용하세요.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* JSON-LD 구조화 데이터 — Course */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              name: "클로드 마스터클래스 2기",
              description:
                "코딩 모르는 50대도 10시간 만에 1인창업 성공하는 클로드 AI 실무 강의. 코워크, 클로드 코드, 웹 활용까지.",
              provider: {
                "@type": "Organization",
                name: "노모어매뉴얼",
                url: "https://nomoremanual-class2.vercel.app",
              },
              offers: {
                "@type": "Offer",
                price: "385000",
                priceCurrency: "KRW",
                availability: "https://schema.org/LimitedAvailability",
                validFrom: "2026-03-16",
              },
              courseMode: "Online",
              totalHistoricalEnrollment: 30,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                bestRating: "5",
                ratingCount: "15",
              },
            }),
          }}
        />

        {/* JSON-LD 구조화 데이터 — FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "코딩을 전혀 몰라도 따라갈 수 있나요?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "네, 강사 본인도 코딩을 모릅니다. 1기 수강생 대부분이 50~70대였고 전원 완주했어요. 한국어로 지시만 하면 되기 때문에 코딩 지식은 0%여도 됩니다.",
                  },
                },
                {
                  "@type": "Question",
                  name: "클로드 Pro 구독이 필요한가요?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Pro 구독($20/월)을 권장합니다. 무료 버전으로도 일부 실습은 가능하지만, 코워크와 클로드 코드를 충분히 활용하려면 Pro가 필요합니다.",
                  },
                },
                {
                  "@type": "Question",
                  name: "수업 방식은 어떤가요? (온라인? 오프라인?)",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Zoom 온라인 라이브 수업입니다. 화면 공유하면서 같이 실습하고, 막히면 즉시 도와드립니다. 녹화본도 제공되니 복습도 가능해요.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Windows와 Mac 모두 가능한가요?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "네, 둘 다 가능합니다. 수업 중 Windows/Mac 각각의 명령어와 설치법을 모두 안내해 드립니다.",
                  },
                },
                {
                  "@type": "Question",
                  name: "환불 정책은 어떻게 되나요?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "1회차 수업 후 만족스럽지 않으시면 전액 환불해 드립니다. 이유를 묻지 않습니다. 2회차 이후에는 잔여 회차 비율로 환불 가능합니다.",
                  },
                },
                {
                  "@type": "Question",
                  name: "1기랑 뭐가 달라요?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "1기 피드백을 100% 반영했습니다. 코워크 실무 자동화 실습 강화, 웹인클로드 리서치 체험 추가, 유형별 맞춤 트랙 세분화, 사전 세팅 가이드 배포로 수업 시간을 더 알차게 구성했습니다.",
                  },
                },
              ],
            }),
          }}
        />

        {/* JSON-LD 구조화 데이터 — Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "노모어매뉴얼",
              url: "https://nomoremanual-class2.vercel.app",
              logo: "https://nomoremanual-class2.vercel.app/og-image.png",
              sameAs: [
                "https://www.youtube.com/@nomoremanual",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${blackHanSans.variable} ${notoSansKR.variable} ${outfit.variable} antialiased`}
      >
        {children}

        {/* 스크롤 깊이 + CTA 클릭 이벤트 추적 스크립트 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                /* 스크롤 깊이 추적 — 25%, 50%, 75%, 100% 도달 시 이벤트 발생 */
                var scrollMarks = [25, 50, 75, 100];
                var firedMarks = {};
                window.addEventListener('scroll', function() {
                  var scrollTop = window.scrollY || document.documentElement.scrollTop;
                  var docHeight = document.documentElement.scrollHeight - window.innerHeight;
                  var scrollPercent = Math.round((scrollTop / docHeight) * 100);
                  scrollMarks.forEach(function(mark) {
                    if (scrollPercent >= mark && !firedMarks[mark]) {
                      firedMarks[mark] = true;
                      if (typeof window.gtag === 'function') {
                        window.gtag('event', 'scroll_depth', { depth: mark + '%' });
                      }
                    }
                  });
                }, { passive: true });

                /* CTA 클릭 추적 — data-cta 속성이 있는 버튼 클릭 시 */
                document.addEventListener('click', function(e) {
                  var target = e.target.closest('[data-cta]');
                  if (target && typeof window.gtag === 'function') {
                    window.gtag('event', 'cta_click', {
                      cta_label: target.getAttribute('data-cta') || 'unknown'
                    });
                  }
                });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
