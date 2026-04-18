/* ── 솔바드 3기 수업관리앱 — 고정 데이터 ──
   수강생 27명 + 4회차 커리큘럼
*/

export const STUDENTS: readonly string[] = [
  "가을",
  "곽광철",
  "권기홍",
  "김기민",
  "김부용",
  "김시몬",
  "김영배",
  "김은량",
  "김준식",
  "김지안",
  "마성호",
  "박경태",
  "박선미",
  "박정은",
  "백승현",
  "백희성",
  "신용운",
  "신인영",
  "심재훈",
  "안선혜",
  "윤진완",
  "이승철",
  "이은경",
  "이은영",
  "이정재",
  "이주현",
  "정을",
  "정정규",
] as const;

export interface Lesson {
  n: number;
  title: string;
  mins: number;
}

export interface SessionMeta {
  id: number;
  num: string;
  title: string;
  subtitle: string;
  date: string;
  dateLabel: string;
  weekday: string;
  day: string;
  month: string;
  duration: number;
  lessons: Lesson[];
}

export const SESSIONS: SessionMeta[] = [
  {
    id: 1,
    num: "01",
    title: "클로드 마스터",
    subtitle: "이해부터 실전 활용까지",
    date: "2026.04.17",
    dateLabel: "4/17 (금)",
    weekday: "금",
    day: "17",
    month: "04",
    duration: 120,
    lessons: [
      { n: 1, title: "클로드, 제대로 이해하기", mins: 30 },
      { n: 2, title: "클로드 코워크(Cowork) 완전정복", mins: 40 },
      { n: 3, title: "실전 실습 — 오늘 바로 써먹는 5가지", mins: 50 },
    ],
  },
  {
    id: 2,
    num: "02",
    title: "아티팩트 & 코워크 심화",
    subtitle: "직접 만들고 자동화하기",
    date: "2026.04.21",
    dateLabel: "4/21 (화)",
    weekday: "화",
    day: "21",
    month: "04",
    duration: 120,
    lessons: [
      { n: 1, title: "아티팩트로 나만의 시작페이지 만들기", mins: 50 },
      { n: 2, title: "아티팩트 활용 확장", mins: 30 },
      { n: 3, title: "코워크 심화 활용", mins: 40 },
    ],
  },
  {
    id: 3,
    num: "03",
    title: "클로드 코드",
    subtitle: "코딩 없이 코딩하는 법",
    date: "2026.04.24",
    dateLabel: "4/24 (금)",
    weekday: "금",
    day: "24",
    month: "04",
    duration: 120,
    lessons: [
      { n: 1, title: "클로드 코드 기초 세팅", mins: 30 },
      { n: 2, title: "클로드 코드의 핵심 개념들", mins: 40 },
      { n: 3, title: "토큰 절약 & 실전 팁", mins: 20 },
      { n: 4, title: "1인 오피스 시연 — 부동산 중개업 편", mins: 30 },
    ],
  },
  {
    id: 4,
    num: "04",
    title: "리모션 & 확장 활용",
    subtitle: "영상도 AI로 만든다",
    date: "2026.04.28",
    dateLabel: "4/28 (화)",
    weekday: "화",
    day: "28",
    month: "04",
    duration: 120,
    lessons: [
      { n: 1, title: "리모션(Remotion) — 코드로 영상 만들기", mins: 60 },
      { n: 2, title: "랜딩페이지 만들기 — 간단 시연", mins: 15 },
      { n: 3, title: "클로드로 할 수 있는 '그 외 모든 것'", mins: 40 },
      { n: 4, title: "1인 창업 로드맵 & 마무리", mins: 20 },
    ],
  },
];

/* ── SESSIONS에 오버라이드 병합 ──
   DB에 저장된 title/subtitle/lessons가 있으면 덮어씌움.
*/
export function mergeSessions(
  overrides: Record<
    number,
    { title?: string | null; subtitle?: string | null; lessons?: Lesson[] | null }
  >
): SessionMeta[] {
  return SESSIONS.map((s) => {
    const o = overrides[s.id];
    if (!o) return s;
    return {
      ...s,
      title: o.title ?? s.title,
      subtitle: o.subtitle ?? s.subtitle,
      lessons: o.lessons ?? s.lessons,
    };
  });
}

/* ── kind 유틸 ── */
export type PostKind = "recap" | "assignment" | "notice";

export const kindLabel = (k: PostKind): string =>
  ({ recap: "수업내용", assignment: "과제", notice: "공지" }[k]);

export const kindEmoji = (k: PostKind): string =>
  ({ recap: "📖", assignment: "✍️", notice: "📣" }[k]);

export const kindVariant = (k: PostKind): "neutral" | "warn" | "accent" =>
  ({ recap: "neutral", assignment: "warn", notice: "accent" } as const)[k];
