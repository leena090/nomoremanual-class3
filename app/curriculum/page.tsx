"use client";

/**
 * 상세 커리큘럼 페이지 — /curriculum
 * - 4강 × 파트별 상세 내용 풀 표시
 * - [실습] / [2026 신기능] / [시연] 뱃지 자동 하이라이트
 * - 랜딩 페이지와 동일한 디자인 시스템 사용
 * - 하단 CTA로 수강 신청 유도
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CaretDown,
  Clock,
  Desktop,
  Lightning,
  Code,
  Video,
  Star,
  CheckCircle,
  Backpack,
  Copy,
  Eye,
  EyeSlash,
  Bank,
  Receipt,
} from "@phosphor-icons/react";
import { ScrollReveal } from "@/components/ScrollReveal";

/* ── 타입 정의 ── */
interface PartData {
  title: string; // 파트 제목
  minutes: number; // 소요 시간 (분)
  items: string[]; // 학습 항목
}

interface SessionData {
  number: number; // 강의 번호
  title: string; // 강의 제목
  subtitle: string; // 한 줄 설명
  icon: React.ReactNode; // 아이콘
  gradient: string; // 카드 상단 그라데이션
  accentColor: string; // 강 고유 색상
  parts: PartData[]; // 파트 배열
  highlight: string; // 하단 하이라이트 메시지
}

/* ── 4강 커리큘럼 데이터 ── */
const sessions: SessionData[] = [
  {
    number: 1,
    title: "클로드 마스터",
    subtitle: "이해부터 실전 활용까지",
    icon: <Lightning size={28} weight="fill" />,
    gradient: "from-[#D4542B]/10 to-transparent",
    accentColor: "#D4542B",
    parts: [
      {
        title: "클로드, 제대로 이해하기",
        minutes: 30,
        items: [
          "클로드 vs ChatGPT vs 제미나이 — 뭐가 다르고, 언제 뭘 쓰나?",
          "클로드 요금제별 차이 (Free / Pro / Max) & 가성비 전략",
          "[★실습] AI의 특징 이해하기 — 안전하게 자율주행하는 법, AI를 믿되 검증하는 습관",
          '[★실습] 프로젝트 기능 활용법 — 시스템 프롬프트로 "나만의 AI 비서" 세팅하기',
          "[★실습] 개인 맞춤 세팅(Personal Setting) — 내 업종·말투·스타일에 맞게 클로드를 나만의 비서로 커스터마이징",
        ],
      },
      {
        title: "클로드 코워크(Cowork) 완전정복",
        minutes: 40,
        items: [
          "코워크란? — 데스크톱에서 AI가 직접 일하는 시대",
          "코워크 설치 & 초기 세팅 (Win/Mac 각각 시연)",
          "[★실습] 폴더 연결 → 파일 읽기/쓰기 → 실시간 작업 흐름",
          "[2026 신기능] 컴퓨터 유즈 — 클로드가 내 화면을 보고 직접 클릭까지",
          "[2026 신기능] 디스패치 — 폰으로 지시, PC에서 결과 확인",
          "[2026 신기능] 스케줄 태스크 — 반복 업무 예약 자동화",
        ],
      },
      {
        title: '실전 실습 — "오늘 바로 써먹는 5가지"',
        minutes: 50,
        items: [
          "[실습] 엑셀 자동 분석 — CSV/엑셀 던지면 → 인터랙티브 HTML 보고서 자동 생성",
          "[실습] PPT 자동 생성 — 주제 한 줄 → 완성형 프레젠테이션",
          "[실습] 워드 문서 자동화 — 보고서/기안문/제안서 템플릿 즉시 생성",
          "[실습] 이메일/보고서 초안 — 상황 설명만으로 업무 문서 완성",
          "[실습] 데이터 정리 — 지저분한 데이터 → 깔끔한 표 + 시각화",
        ],
      },
    ],
    highlight:
      '각 실습은 "직장인 업무", "1인 창업 업무", "유튜버 업무" 3가지 시나리오로 진행',
  },
  {
    number: 2,
    title: "아티팩트 & 코워크 심화",
    subtitle: "직접 만들고 자동화하기",
    icon: <Desktop size={28} weight="fill" />,
    gradient: "from-[#2E7D32]/10 to-transparent",
    accentColor: "#2E7D32",
    parts: [
      {
        title: "아티팩트로 나만의 시작페이지 만들기",
        minutes: 50,
        items: [
          "아티팩트란? — 대화창 안에서 바로 돌아가는 앱/웹페이지",
          "HTML/React 아티팩트의 차이와 활용 시점",
          "[★실습] 나만의 업무 대시보드 시작페이지 만들기",
          "즐겨찾기 링크 + 시계 + 할일 + 메모 올인원 페이지",
          "디자인 커스터마이징 (색상, 폰트, 레이아웃)",
          "[실습] 랜딩페이지/소개페이지 만들기",
          "1인 창업용 서비스 소개 페이지 실전 제작",
          "반응형 디자인 + 구글 폰트 적용",
        ],
      },
      {
        title: "아티팩트 활용 확장",
        minutes: 30,
        items: [
          "계산기/견적서/예약 폼 등 실무 미니앱 만들기",
          "SVG/Mermaid 다이어그램 — 플로우차트, 조직도 자동 생성",
          "인터랙티브 차트/그래프 시각화",
        ],
      },
      {
        title: "코워크 심화 활용",
        minutes: 40,
        items: [
          '[★실습] 스킬(Skills) 개념 — 클로드에게 "전문 능력"을 장착시키기',
          "플러그인 & 커넥터 — 노션, 구글캘린더, 구글드라이브 연동",
          '[실습] 구글 캘린더 연동 → "오늘 일정 알려줘" 자동화',
          "[실습] 노션 연동 → 회의록/할일 자동 정리",
          "[2026 신기능] 크롬 확장 연동 — 웹 브라우징 자동화",
          "실무 자동화 워크플로우 설계 팁",
        ],
      },
    ],
    highlight: "이 강의가 끝나면, 클로드에게 직접 앱과 자동화를 만들어달라고 시킬 수 있습니다",
  },
  {
    number: 3,
    title: "클로드 코드",
    subtitle: "코딩 없이 코딩하는 법",
    icon: <Code size={28} weight="fill" />,
    gradient: "from-[#5B21B6]/10 to-transparent",
    accentColor: "#5B21B6",
    parts: [
      {
        title: "클로드 코드 기초 세팅",
        minutes: 30,
        items: [
          "클로드 코드란? — 터미널에서 AI와 대화하며 개발하기",
          "설치법 (Win: PowerShell / Mac: Terminal) — 각각 비교 시연",
          "기본 명령어 정리 — 시작, 대화, 코드 자동 생성",
          "토큰이란? 비용 구조 이해",
        ],
      },
      {
        title: "클로드 코드의 핵심 개념들",
        minutes: 40,
        items: [
          'CLAUDE.md — 프로젝트의 "설명서"를 써주면 AI가 맥락을 기억',
          "[실습] 나만의 CLAUDE.md 작성하기",
          'MCP (Model Context Protocol) — "AI에게 팔다리를 달아주는 것"',
          "MCP 서버 찾기 & 설치하기",
          '스킬(Skills) — 반복 작업을 "레시피"로 저장',
          "에이전트 팀(Agent Teams) — 여러 AI가 역할 분담하여 협업",
        ],
      },
      {
        title: "토큰 절약 & 실전 팁",
        minutes: 20,
        items: [
          "compact 명령어 활용",
          "CLAUDE.md로 반복 지시 줄이기",
          "서브에이전트 활용으로 컨텍스트 분리",
          "작업 범위 명확히 지정하기",
          ".claudeignore로 불필요한 파일 읽기 방지",
          "모델 선택 전략 (opus/sonnet/haiku 적재적소)",
        ],
      },
      {
        title: "1인 오피스 시연 — 부동산 중개업 편",
        minutes: 30,
        items: [
          "[시연] 부동산 중개업 1인 오피스 전체 프로세스 라이브",
          "매물 정보 접수 → 클로드가 매물 카드 자동 생성",
          "고객 문의 응대 자동화 — 문자/카톡 답변 초안 작성",
          "계약서/중개대상물 확인서 자동 생성 (HWPX/PDF)",
          "매물 홍보용 SNS 포스트 + 블로그 글 원클릭 생성",
          "월간 실적 보고서 자동 정리 — 엑셀 → 시각화 리포트",
          "[★실습] 체이닝 스킬로 하나의 워크플로우 설계 — 접수부터 홍보까지 딸깍! 한 번에 실행",
          "클로드 하나로 사무직원 1명분의 업무를 처리하는 모습을 직접 확인",
        ],
      },
    ],
    highlight:
      "자연어 한 줄로 웹사이트 만들기, 자동화 스크립트, 바이브코딩 라이브 시연 포함",
  },
  {
    number: 4,
    title: "리모션 & 확장 활용",
    subtitle: "영상도 AI로 만든다",
    icon: <Video size={28} weight="fill" />,
    gradient: "from-[#B45309]/10 to-transparent",
    accentColor: "#B45309",
    parts: [
      {
        title: "리모션(Remotion) — 코드로 영상 만들기",
        minutes: 60,
        items: [
          "[★실습] 리모션이란? — React 기반, 코드로 만드는 프로그래밍 영상 제작",
          '"나는 코딩 못하는데?" → 클로드 코드가 대신 짜줌 (자연어 → 영상 코드)',
          "리모션 설치 & 프로젝트 생성 — 자연어 한 줄로 영상 프로젝트 시작",
        ],
      },
      {
        title: "랜딩페이지 만들기 — 간단 시연",
        minutes: 15,
        items: [
          "[★실습] 클로드 코드로 나만의 상품 판매 페이지 완성 — 자연어 지시만으로 실제 웹페이지 생성",
        ],
      },
      {
        title: '클로드로 할 수 있는 "그 외 모든 것"',
        minutes: 40,
        items: [
          "[★실습] 전자책 제작 — 커스텀 스킬팩으로 나만의 전자책 자동 생성 (PDF + 웹 ebook)",
          "PDF 생성/편집 — 계약서, 포트폴리오 제작",
          "한글(HWPX) 문서 — 공문서/보고서 자동 생성",
          "SEO 블로그 글쓰기 — 키워드 리서치 → SEO 최적화 글 자동 작성",
          "수노(Suno) 음악 제작 연동 — 프롬프트 + 가사 + 뮤직비디오까지",
          "디자인/포스터 제작 — 캔버스 디자인으로 시각물 생성",
          "스케줄 자동화 — 반복 작업 예약 실행",
        ],
      },
      {
        title: "1인 창업 로드맵 & 마무리",
        minutes: 20,
        items: [
          "클로드 하나로 1인 창업 전체 프로세스 정리",
          "아이디어 검증 → 랜딩페이지 → MVP → 마케팅 → 운영",
          "수강 후 셀프 학습 로드맵",
          "전용 단톡방 활용법 & Q&A",
        ],
      },
    ],
    highlight:
      "코드 한 줄 안 쓰고 영상을 만들고, PDF·문서·음악까지 — 클로드의 한계를 넓히는 시간",
  },
];

/* ── 텍스트에서 뱃지 키워드를 감지하여 스타일링하는 헬퍼 ── */
function formatItem(text: string) {
  /* [★실습] 강조 뱃지 — 형광펜 + 별표 */
  if (text.startsWith("[★실습]")) {
    return (
      <span className="flex items-start gap-2">
        <span className="shrink-0 mt-0.5 inline-flex items-center gap-1 rounded-md bg-[#D4542B] px-2 py-0.5 text-[11px] font-bold text-white tracking-wide">
          ★ 실습
        </span>
        <span>
          <mark className="bg-[#FFF3CD] px-1 rounded text-[#1A1A1A] font-bold" style={{ boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
            {text.replace("[★실습] ", "")}
          </mark>
        </span>
      </span>
    );
  }
  /* [실습] 뱃지 */
  if (text.startsWith("[실습]")) {
    return (
      <span className="flex items-start gap-2">
        <span className="shrink-0 mt-0.5 inline-flex items-center gap-1 rounded-md bg-[#D4542B]/10 px-2 py-0.5 text-[11px] font-bold text-[#D4542B] tracking-wide">
          실습
        </span>
        <span>{text.replace("[실습] ", "")}</span>
      </span>
    );
  }
  /* [2026 신기능] 뱃지 */
  if (text.startsWith("[2026 신기능]")) {
    return (
      <span className="flex items-start gap-2">
        <span className="shrink-0 mt-0.5 inline-flex items-center gap-1 rounded-md bg-[#5B21B6]/10 px-2 py-0.5 text-[11px] font-bold text-[#5B21B6] tracking-wide">
          NEW
        </span>
        <span>{text.replace("[2026 신기능] ", "")}</span>
      </span>
    );
  }
  /* [시연] 뱃지 */
  if (text.startsWith("[시연]")) {
    return (
      <span className="flex items-start gap-2">
        <span className="shrink-0 mt-0.5 inline-flex items-center gap-1 rounded-md bg-[#B45309]/10 px-2 py-0.5 text-[11px] font-bold text-[#B45309] tracking-wide">
          시연
        </span>
        <span>{text.replace("[시연] ", "")}</span>
      </span>
    );
  }
  return <span>{text}</span>;
}

/* ── 세션 카드 컴포넌트 ── */
function SessionCard({ session, index }: { session: SessionData; index: number }) {
  /* 모든 파트를 기본 닫힘 상태로 */
  const [openParts, setOpenParts] = useState<boolean[]>(
    session.parts.map(() => false)
  );

  const togglePart = (partIdx: number) => {
    setOpenParts((prev) => prev.map((v, i) => (i === partIdx ? !v : v)));
  };

  return (
    <ScrollReveal delay={index * 0.1}>
      <div className="relative overflow-hidden rounded-3xl border border-[#E0DDD5] bg-white">
        {/* 카드 상단 — 강 번호 + 제목 */}
        <div
          className={`relative px-8 pt-8 pb-6 bg-gradient-to-b ${session.gradient}`}
        >
          {/* 강 번호 배지 */}
          <div className="flex items-center gap-4 mb-3">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-2xl text-white"
              style={{ backgroundColor: session.accentColor }}
            >
              {session.icon}
            </div>
            <div>
              <div
                className="text-[13px] font-bold tracking-widest uppercase mb-1"
                style={{ color: session.accentColor }}
              >
                {session.number}강
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-[clamp(22px,4vw,28px)] leading-tight text-[#1A1A1A]">
                {session.title}
              </h3>
            </div>
          </div>
          <p className="text-[15px] text-[#6B6B6B] ml-[72px]">
            {session.subtitle}
          </p>

          {/* 총 시간 표시 */}
          <div className="absolute top-8 right-8 flex items-center gap-1.5 text-[13px] text-[#6B6B6B]">
            <Clock size={16} weight="bold" />
            <span className="font-[family-name:var(--font-accent)] font-semibold">
              120
            </span>
            분
          </div>
        </div>

        {/* 파트별 리스트 */}
        <div className="px-8 pb-6">
          {session.parts.map((part, pIdx) => (
            <div
              key={pIdx}
              className={`${pIdx > 0 ? "mt-1" : "mt-2"}`}
            >
              {/* 파트 헤더 — 제목 + 시간 (항상 보임) */}
              <div className="flex items-center gap-3 py-3">
                {/* 파트 번호 */}
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-[12px] font-bold text-white shrink-0"
                  style={{ backgroundColor: session.accentColor + "CC" }}
                >
                  {pIdx + 1}
                </span>
                {/* 파트 제목 */}
                <span className="flex-1 text-left text-[15px] font-bold text-[#2D2D2D]">
                  {part.title}
                </span>
                {/* 시간 */}
                <span className="text-[12px] text-[#999] font-[family-name:var(--font-accent)] shrink-0">
                  {part.minutes}분
                </span>
              </div>

              {/* "자세한 내용 확인하기" 버튼 */}
              <div className="pl-10">
                <button
                  onClick={() => togglePart(pIdx)}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium cursor-pointer select-none transition-colors rounded-lg px-3 py-1.5 -ml-3 hover:bg-[#F5F5F0]"
                  style={{ color: session.accentColor }}
                >
                  {openParts[pIdx] ? "접기" : "자세한 내용 확인하기"}
                  <CaretDown
                    size={14}
                    weight="bold"
                    className={`transition-transform duration-300 ${
                      openParts[pIdx] ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
              </div>

              {/* 파트 내용 — 버튼 클릭 시 펼침 */}
              <AnimatePresence initial={false}>
                {openParts[pIdx] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <ul className="pl-10 pt-2 pb-3 space-y-2">
                      {part.items.map((item, iIdx) => (
                        <li
                          key={iIdx}
                          className="flex items-start gap-2.5 text-[14px] leading-[1.7] text-[#555]"
                        >
                          <CheckCircle
                            size={16}
                            weight="fill"
                            className="shrink-0 mt-[3px]"
                            style={{ color: session.accentColor + "99" }}
                          />
                          {formatItem(item)}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 파트 구분선 */}
              {pIdx < session.parts.length - 1 && (
                <div className="border-b border-dashed border-[#E0DDD5] ml-10 mt-1" />
              )}
            </div>
          ))}
        </div>

        {/* 하이라이트 바 */}
        <div
          className="px-8 py-4 text-[13px] border-t border-[#E0DDD5]"
          style={{
            backgroundColor: session.accentColor + "08",
            color: session.accentColor,
          }}
        >
          <Star size={14} weight="fill" className="inline mr-1.5 -mt-0.5" />
          <span className="font-medium">{session.highlight}</span>
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ── 계좌이체 안내 박스 ── */
function PaymentBox() {
  const [showAccount, setShowAccount] = useState(false);
  const [copied, setCopied] = useState(false);

  const accountNumber = "1002-732-561308";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="pb-16">
      <div className="max-w-[900px] mx-auto px-6">
        <ScrollReveal>
          <div className="rounded-3xl border border-[#E0DDD5] bg-white overflow-hidden">
            <div className="px-8 pt-8 pb-6">
              {/* 헤더 */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
                  <Bank size={24} weight="fill" />
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-[22px] text-[#1A1A1A]">
                  계좌이체 안내
                </h2>
              </div>

              {/* 계좌 정보 카드 */}
              <div className="rounded-2xl border border-[#E0DDD5] bg-[#FAFAF7] p-6">
                {/* 은행 + 금액 */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[13px] text-[#999]">우리은행</p>
                  <div className="text-right">
                    <p className="font-[family-name:var(--font-accent)] text-[14px] text-[#999] line-through">
                      295,000원
                    </p>
                    <p className="font-[family-name:var(--font-accent)] text-[24px] font-bold text-[#D4542B]">
                      285,000
                      <span className="text-[14px] font-medium text-[#999] ml-1">원</span>
                    </p>
                    <p className="text-[11px] text-[#2E7D32] font-medium mt-0.5">
                      현금 결제 시 1만원 할인
                    </p>
                  </div>
                </div>

                {/* 계좌번호 + 예금주 — 열기/닫기 + 복사 */}
                <div className="rounded-xl border border-[#E0DDD5] bg-white p-4">
                  {showAccount ? (
                    <div>
                      <p className="text-[13px] text-[#999] mb-2">
                        예금주: <span className="font-bold text-[#1A1A1A]">이미영</span>
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-[family-name:var(--font-accent)] text-[20px] font-semibold text-[#1A1A1A] tracking-wide">
                          {accountNumber}
                        </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopy}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#D4542B] px-3 py-1.5 text-[12px] font-bold text-white cursor-pointer hover:bg-[#C04425] transition-colors"
                        >
                          <Copy size={14} weight="bold" />
                          {copied ? "복사됨!" : "복사"}
                        </button>
                        <button
                          onClick={() => setShowAccount(false)}
                          className="inline-flex items-center gap-1 rounded-lg border border-[#E0DDD5] px-3 py-1.5 text-[12px] text-[#999] cursor-pointer hover:bg-[#F5F5F0] transition-colors"
                        >
                          <EyeSlash size={14} weight="bold" />
                          닫기
                        </button>
                      </div>
                    </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] text-[#999]">
                        계좌번호를 확인하려면 →
                      </span>
                      <button
                        onClick={() => setShowAccount(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4542B] px-4 py-1.5 text-[13px] font-bold text-[#D4542B] cursor-pointer hover:bg-[#FFF0EB] transition-colors"
                      >
                        <Eye size={16} weight="bold" />
                        계좌번호 보기
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 하단 정보 — 현금영수증 + 사업자 */}
              <div className="flex items-center justify-between mt-5 px-1">
                <div className="flex items-center gap-2 text-[13px] text-[#6B6B6B]">
                  <Receipt size={16} weight="fill" className="text-[#2E7D32]" />
                  <span className="font-medium">현금영수증 발급 가능</span>
                </div>
                <p className="text-[12px] text-[#999]">
                  사업자등록번호 545-94-02228 · 노모어매뉴얼
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ── 메인 페이지 ── */
export default function CurriculumPage() {
  return (
    <main className="min-h-screen bg-[var(--c-bg)]">
      {/* ── 상단 네비게이션 ── */}
      <nav className="sticky top-0 z-50 border-b border-[#E0DDD5] bg-[var(--c-bg)]/80 backdrop-blur-xl">
        <div className="max-w-[900px] mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-[family-name:var(--font-display)] text-[18px] text-[#1A1A1A]">
            솔바드 3기
          </span>
          <a
            href="#apply"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#D4542B] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#C04425] transition-colors"
          >
            수강 신청
          </a>
        </div>
      </nav>

      {/* ── 페이지 헤더 ── */}
      <header className="pt-16 pb-12 text-center">
        <div className="max-w-[900px] mx-auto px-6">
          <ScrollReveal>
            <span className="inline-block text-xs font-bold tracking-widest text-[#D4542B] bg-[#FFF0EB] px-3.5 py-1.5 rounded-full uppercase mb-5">
              상세 커리큘럼
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(28px,5.5vw,44px)] leading-[1.25] tracking-tight text-[#1A1A1A] mb-4">
              4회 × 120분 =&nbsp;
              <em className="not-italic text-[#D4542B]">480분의 마법</em>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <p className="text-[16px] text-[#6B6B6B] max-w-[520px] mx-auto leading-[1.7]">
              클로드 기초부터 바이브코딩, 영상 제작까지
              <br />
              매 회차가 끝나면 &ldquo;이게 된다고?&rdquo; 연발하게 됩니다
            </p>
          </ScrollReveal>

          {/* 요약 통계 */}
          <ScrollReveal delay={0.15}>
            <div className="flex justify-center gap-6 mt-8 flex-wrap">
              {[
                { label: "총 수업 시간", value: "8시간" },
                { label: "수강료", value: "295,000원" },
                { label: "전자책 스킬팩 증정", value: "10만원 상당", accent: true },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`flex flex-col items-center px-5 py-3 rounded-2xl border ${
                    "accent" in stat && stat.accent
                      ? "border-[#D4542B]/20 bg-[#FFF0EB]"
                      : "border-[#E0DDD5] bg-white"
                  }`}
                >
                  <span className={`font-[family-name:var(--font-display)] text-[22px] ${
                    "accent" in stat && stat.accent ? "text-[#D4542B]" : "text-[#1A1A1A]"
                  }`}>
                    {stat.value}
                  </span>
                  <span className="text-[12px] text-[#999] mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* ── 수업 철학 강조 ── */}
      <section className="max-w-[900px] mx-auto px-6 pb-12">
        <ScrollReveal>
          <div className="relative rounded-3xl border border-[#D4542B]/20 bg-gradient-to-br from-[#FFF0EB] to-[#FAFAF7] p-8 sm:p-10 overflow-hidden">
            {/* 배경 장식 */}
            <div
              className="absolute top-0 right-0 w-40 h-40 opacity-[0.07] pointer-events-none"
              style={{
                background: "radial-gradient(circle, #D4542B 0%, transparent 70%)",
              }}
            />

            <p className="text-[13px] font-bold text-[#D4542B] tracking-widest uppercase mb-4">
              이 수업이 다른 이유
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(20px,4vw,26px)] leading-[1.4] text-[#1A1A1A] mb-3">
              버튼 위치를 알려주는 수업이 아닙니다
            </h2>
            <p className="text-[15px] text-[#6B6B6B] mb-6 leading-[1.7]">
              기능 설명은 유튜브에도 넘칩니다. 이 수업은&nbsp;
              <strong className="text-[#1A1A1A]">&ldquo;그래서 나는 이걸로 뭘 할 건데?&rdquo;</strong>
              에 답하는 시간입니다.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { question: "무엇을 팔 것인가", desc: "내 경험과 지식을 상품으로 만드는 법" },
                { question: "무엇을 만들 것인가", desc: "아이디어를 실제 결과물로 완성하는 과정" },
                { question: "무엇을 해 보고 싶은가", desc: "기술 걱정 없이 도전할 수 있는 자신감" },
                { question: "무엇을 개선시킬 것인가", desc: "지금 하는 일을 AI로 10배 효율화" },
              ].map((item) => (
                <div
                  key={item.question}
                  className="flex items-start gap-3 rounded-xl bg-white/70 border border-[#E0DDD5]/50 p-4"
                >
                  <span
                    className="shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center rounded-full text-white text-[12px] font-bold"
                    style={{ backgroundColor: "#D4542B" }}
                  >
                    ?
                  </span>
                  <div>
                    <p className="text-[15px] font-bold text-[#1A1A1A]">{item.question}</p>
                    <p className="text-[13px] text-[#6B6B6B] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[13px] text-[#6B6B6B] mt-6 leading-[1.7]">
              클로드는 도구일 뿐입니다. 중요한 건 <strong className="text-[#1A1A1A]">당신이 무엇을 하고 싶은지</strong>입니다.
              <br />
              이 수업은 그 답을 함께 찾아가는 과정이며, 수업이 끝난 뒤
              <strong className="text-[#1A1A1A]"> 자신감을 가지고 그 여정을 시작</strong>할 수 있도록 돕습니다.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ── 왜 8시간이면 충분한가 — 초대장 ── */}
      <section className="max-w-[900px] mx-auto px-6 pb-12">
        <ScrollReveal>
          <div className="relative rounded-3xl border border-[#E0DDD5] bg-white overflow-hidden">
            {/* 상단 액센트 라인 */}
            <div className="h-1 bg-gradient-to-r from-[#D4542B] via-[#F5C36A] to-[#2E7D32]" />

            <div className="px-8 sm:px-10 pt-10 pb-10">
              {/* 헤드라인 */}
              <p className="text-[13px] font-bold text-[#F5C36A] tracking-widest uppercase mb-3">
                Invitation
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(22px,4.5vw,30px)] leading-[1.35] text-[#1A1A1A] mb-8">
                왜 8시간이면 충분할까요?
              </h2>

              {/* 본문 — 편지 형식 */}
              <div className="space-y-5 text-[15px] leading-[1.85] text-[#444]">
                <p>
                  이 수업은 코딩을 가르치지 않습니다.
                  <br />
                  <strong className="text-[#1A1A1A]">한국어로 말할 수 있으면 준비 끝</strong>입니다.
                  AI에게 지시하는 법을 배우는 거니까요.
                </p>

                <p>
                  운전면허 학원을 떠올려 보세요.
                  <br />
                  버튼 위치를 외우는 곳이 아닙니다.
                  <strong className="text-[#1A1A1A]"> &ldquo;어디로 갈지&rdquo; 정하고, 핸들 잡는 감각을 익히는 곳</strong>이죠.
                  <br />
                  클로드도 마찬가지입니다 — 8시간이면 혼자 운전할 수 있습니다.
                </p>

                {/* 2주 구조 */}
                <div className="grid sm:grid-cols-2 gap-3 my-2">
                  <div className="rounded-xl bg-[#FAFAF7] border border-[#E0DDD5]/50 p-5">
                    <p className="text-[12px] font-bold text-[#D4542B] tracking-widest mb-2">1주차</p>
                    <p className="text-[14px] font-bold text-[#1A1A1A] mb-1">
                      클로드를 이해하고 내 것으로 만드는 시간
                    </p>
                    <p className="text-[13px] text-[#999]">
                      기초 세팅부터 코워크·아티팩트까지
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#FAFAF7] border border-[#E0DDD5]/50 p-5">
                    <p className="text-[12px] font-bold text-[#2E7D32] tracking-widest mb-2">2주차</p>
                    <p className="text-[14px] font-bold text-[#1A1A1A] mb-1">
                      직접 만들고, 세상에 내놓는 시간
                    </p>
                    <p className="text-[13px] text-[#999]">
                      클로드 코드·리모션·실전 배포까지
                    </p>
                  </div>
                </div>

                <p>
                  사이사이 과제로 손에 익히고, 녹화본으로 몇 번이든 복습할 수 있습니다.
                </p>

                {/* 비교 */}
                <div className="rounded-xl bg-[#1A1A1A] text-white p-6 mt-2">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[12px] text-[#999] mb-1">다른 AI 강의</p>
                      <p className="text-[15px] font-medium leading-[1.6]">
                        40시간 듣고도
                        <br />
                        <span className="text-[#999]">&ldquo;그래서 뭘 하지?&rdquo;</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] text-[#F5C36A] mb-1">솔바드</p>
                      <p className="text-[15px] font-medium leading-[1.6]">
                        8시간 듣고
                        <br />
                        <span className="text-[#F5C36A] font-bold">&ldquo;이거 내가 만든 거예요&rdquo;</span>
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-[14px] text-[#6B6B6B] pt-2">
                  8시간은 시작점이지, 끝이 아닙니다.
                  <br />
                  <strong className="text-[#1A1A1A]">혼자서도 계속 갈 수 있는 자신감</strong>을 드리는 것,
                  그것이 이 수업의 약속입니다.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── 4강 커리큘럼 카드 ── */}
      <section className="max-w-[900px] mx-auto px-6 pb-12 space-y-8">
        {sessions.map((session, idx) => (
          <SessionCard key={session.number} session={session} index={idx} />
        ))}

        {/* 커리큘럼 변동 안내 */}
        <div className="flex items-start gap-2.5 rounded-2xl border border-[#F5C36A]/30 bg-[#FFFBF0] px-6 py-4">
          <span className="shrink-0 mt-0.5 text-[18px]">⚠️</span>
          <p className="text-[13px] text-[#8B7355] leading-[1.7]">
            <strong className="text-[#6B5B3E]">커리큘럼 변동 안내</strong>
            <br />
            상세 내용과 구성은 클로드의 업데이트 상황 및 수업 진행 상황에 따라 변동될 수 있습니다.
            항상 최신 기능을 반영하여 가장 실용적인 수업을 제공합니다.
          </p>
        </div>
      </section>

      {/* ── 수강생 준비물 ── */}
      <section className="border-t border-[#E0DDD5] py-16">
        <div className="max-w-[900px] mx-auto px-6">
          <ScrollReveal>
            <div className="rounded-3xl border border-[#E0DDD5] bg-white overflow-hidden">
              <div className="px-8 pt-8 pb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#F5E6D3] text-[#B45309]">
                    <Backpack size={24} weight="fill" />
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-[22px] text-[#1A1A1A]">
                    수강생 준비물
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: "💻",
                      title: "PC (윈도우 또는 맥)",
                      desc: "핸드폰 불가 · 메모리 16GB 이상 권장",
                    },
                    {
                      icon: "🤖",
                      title: "Claude Pro 또는 Max 구독 필수",
                      desc: "클로드 코드 사용을 위해 필수",
                    },
                    {
                      icon: "🌐",
                      title: "Chrome 브라우저",
                      desc: "사전 설치 필요",
                    },
                    {
                      icon: "⌨️",
                      title: "클로드 코드 설치",
                      desc: "설치법은 3강 전에 안내 예정",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAF7] border border-[#E0DDD5]/50"
                    >
                      <span className="text-[24px] shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-[14px] font-bold text-[#2D2D2D]">
                          {item.title}
                        </p>
                        <p className="text-[13px] text-[#999] mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 공통 구성 테이블 */}
              <div className="px-8 py-6 border-t border-[#E0DDD5] bg-[#FAFAF7]">
                <h3 className="text-[14px] font-bold text-[#2D2D2D] mb-4">
                  각 강의 공통 구성
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "이론 / 시연",
                      time: "120분",
                      desc: "개념 + 라이브 시연",
                    },
                    {
                      label: "실습",
                      time: "과제 100%",
                      desc: "매 회차 과제로 직접 실습",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="text-center p-3 rounded-xl bg-white border border-[#E0DDD5]/50"
                    >
                      <p className="text-[13px] font-bold text-[#2D2D2D]">
                        {item.label}
                      </p>
                      <p className="font-[family-name:var(--font-accent)] text-[18px] font-semibold text-[#D4542B] my-1">
                        {item.time}
                      </p>
                      <p className="text-[11px] text-[#999]">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[13px] text-[#999] mt-4 leading-[1.6]">
                  * 원활한 수업 진행을 위해 수업 중 개별 실습은 진행하지 않으며, 실습은 과제로 대체합니다.
                  <br />
                  &nbsp;&nbsp;전 회차 녹화본을 제공하므로, 언제든지 다시 보시면서 실습하실 수 있습니다.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 수업 포함사항 ── */}
      <section className="pb-16">
        <div className="max-w-[900px] mx-auto px-6">
          <ScrollReveal>
            <div className="rounded-3xl border border-[#E0DDD5] bg-white overflow-hidden">
              <div className="px-8 pt-8 pb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#FFF0EB] text-[#D4542B]">
                    <Star size={24} weight="fill" />
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-[22px] text-[#1A1A1A]">
                    수업 포함사항
                  </h2>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      icon: "🎬",
                      title: "전 회차 녹화본 제공",
                      desc: "결석 시에도 복습 가능",
                    },
                    {
                      icon: "💬",
                      title: "전용 카카오톡 코칭 시스템",
                      desc: "수강 후에도 질문 & 정보 공유",
                    },
                    {
                      icon: "⚡",
                      title: "전자책 제작용 커스텀 스킬 패키지 증정",
                      desc: "10만원 상당 — 클로드 코드에서 바로 사용 가능한 전자책 자동 제작 스킬셋",
                      highlight: true,
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className={`flex items-start gap-3 p-4 rounded-xl border ${
                        "highlight" in item && item.highlight
                          ? "bg-[#FFF0EB] border-[#D4542B]/20"
                          : "bg-[#FAFAF7] border-[#E0DDD5]/50"
                      }`}
                    >
                      <span className="text-[24px] shrink-0">{item.icon}</span>
                      <div className="flex-1">
                        <p className="text-[14px] font-bold text-[#2D2D2D]">
                          {item.title}
                          {"highlight" in item && item.highlight && (
                            <span className="ml-2 inline-flex items-center rounded-md bg-[#D4542B] px-2 py-0.5 text-[10px] font-bold text-white align-middle">
                              BONUS
                            </span>
                          )}
                        </p>
                        <p className="text-[13px] text-[#999] mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 계좌이체 안내 ── */}
      <PaymentBox />

      {/* ── 하단 CTA ── */}
      <section className="pb-20 text-center">
        <ScrollReveal>
          <div className="max-w-[900px] mx-auto px-6">
            <p className="text-[15px] text-[#6B6B6B] mb-4">
              궁금한 건 다 풀리셨나요?
            </p>
            <a
              href="#apply"
              className="inline-flex items-center gap-2 rounded-xl bg-[#D4542B] px-10 py-4 text-[17px] font-bold text-white hover:bg-[#C04425] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(212,84,43,0.4)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              수강 신청하러 가기 →
            </a>
            <p className="text-[13px] text-[#999] mt-4">
              추가 질문은{" "}
              <a
                href="https://discord.gg/MEX7vNTj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5865F2] font-bold hover:underline"
              >
                디스코드
              </a>
              에서 편하게 남겨주세요
            </p>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
