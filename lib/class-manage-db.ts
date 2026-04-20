import { neon } from "@neondatabase/serverless";

/* ── Neon 클라이언트 (수업관리앱 전용) ──
   기존 lib/db.ts 와 동일 패턴. Mock 모드 지원.
*/
const DATABASE_URL = process.env.DATABASE_URL || "";
export const isMockMode = !DATABASE_URL;
const sql = isMockMode ? null : neon(DATABASE_URL);

/* ── 타입 ─────────────────────────────────── */
export type PostKind = "recap" | "assignment" | "notice";

export interface Post {
  id: string;
  session_id: number;
  kind: PostKind;
  title: string;
  body: string;
  posted_at: string;
  created_at?: string;
  updated_at?: string;
}

export type PostsBySession = Record<number, Post[]>;
export type AcksByPost = Record<string, string[]>;

export type SessionStatus = "past" | "live" | "upcoming";
export type StatusesBySession = Record<number, SessionStatus>;

export interface Lesson {
  n: number;
  title: string;
  mins: number;
}

/* ── 기본값을 덮어쓰는 부분 필드만 저장 (null이면 기본값 사용) ── */
export interface SessionMetaOverride {
  title?: string | null;
  subtitle?: string | null;
  lessons?: Lesson[] | null;
}
export type OverridesBySession = Record<number, SessionMetaOverride>;

/* ── 데모용 인메모리 저장소 (Mock 모드에서만 사용) ── */
const mockPosts: Post[] = [];
const mockAcks: Array<{ post_id: string; student_name: string }> = [];

/* ── 전체 게시글 조회 → { [session_id]: Post[] } ── */
export async function getAllPosts(): Promise<PostsBySession> {
  if (isMockMode || !sql) {
    return groupPostsBySession(mockPosts);
  }

  /* 세션 오름차순 + 생성시간 오름차순 */
  const rows = (await sql`
    SELECT id, session_id, kind, title, body, posted_at,
           created_at::text, updated_at::text
    FROM class_posts
    ORDER BY session_id ASC, created_at ASC
  `) as Post[];

  return groupPostsBySession(rows);
}

function groupPostsBySession(rows: Post[]): PostsBySession {
  const out: PostsBySession = { 1: [], 2: [], 3: [], 4: [] };
  for (const r of rows) {
    (out[r.session_id] ||= []).push(r);
  }
  return out;
}

/* ── 전체 확인 조회 → { [post_id]: studentName[] } ── */
export async function getAllAcks(): Promise<AcksByPost> {
  if (isMockMode || !sql) {
    return groupAcks(mockAcks);
  }

  const rows = (await sql`
    SELECT post_id, student_name
    FROM class_acks
    ORDER BY acked_at ASC
  `) as Array<{ post_id: string; student_name: string }>;

  return groupAcks(rows);
}

function groupAcks(
  rows: Array<{ post_id: string; student_name: string }>
): AcksByPost {
  const out: AcksByPost = {};
  for (const r of rows) {
    (out[r.post_id] ||= []).push(r.student_name);
  }
  return out;
}

/* ── 게시글 생성 (강사 전용) ── */
export async function createPost(data: {
  session_id: number;
  kind: PostKind;
  title: string;
  body: string;
}): Promise<Post> {
  /* ID: p{session}-{timestamp} — 프로토타입과 동일 */
  const id = `p${data.session_id}-${Date.now()}`;
  const posted_at = formatPostedAt(new Date());

  const post: Post = {
    id,
    session_id: data.session_id,
    kind: data.kind,
    title: data.title,
    body: data.body,
    posted_at,
  };

  if (isMockMode || !sql) {
    mockPosts.push(post);
    return post;
  }

  await sql`
    INSERT INTO class_posts (id, session_id, kind, title, body, posted_at)
    VALUES (${id}, ${data.session_id}, ${data.kind}, ${data.title}, ${data.body}, ${posted_at})
  `;
  return post;
}

/* ── 게시글 수정 (강사 전용) ── */
export async function updatePost(
  id: string,
  data: { kind?: PostKind; title?: string; body?: string }
): Promise<{ success: boolean }> {
  if (isMockMode || !sql) {
    const p = mockPosts.find((m) => m.id === id);
    if (p) Object.assign(p, data);
    return { success: !!p };
  }

  /* 부분 업데이트 — 제공된 필드만 갱신 */
  await sql`
    UPDATE class_posts
    SET
      kind = COALESCE(${data.kind ?? null}, kind),
      title = COALESCE(${data.title ?? null}, title),
      body = COALESCE(${data.body ?? null}, body),
      updated_at = now()
    WHERE id = ${id}
  `;
  return { success: true };
}

/* ── 게시글 삭제 (강사 전용, 연관 ack 자동 삭제) ── */
export async function deletePost(id: string): Promise<{ success: boolean }> {
  if (isMockMode || !sql) {
    const i = mockPosts.findIndex((m) => m.id === id);
    if (i >= 0) mockPosts.splice(i, 1);
    return { success: i >= 0 };
  }

  await sql`DELETE FROM class_posts WHERE id = ${id}`;
  return { success: true };
}

/* ── 확인 토글 (학생) ──
   이미 누른 상태면 취소, 아니면 추가.
*/
export async function toggleAck(
  post_id: string,
  student_name: string
): Promise<{ acked: boolean }> {
  if (isMockMode || !sql) {
    const i = mockAcks.findIndex(
      (a) => a.post_id === post_id && a.student_name === student_name
    );
    if (i >= 0) {
      mockAcks.splice(i, 1);
      return { acked: false };
    }
    mockAcks.push({ post_id, student_name });
    return { acked: true };
  }

  const existing = (await sql`
    SELECT 1 FROM class_acks
    WHERE post_id = ${post_id} AND student_name = ${student_name}
    LIMIT 1
  `) as unknown[];

  if (existing.length > 0) {
    await sql`
      DELETE FROM class_acks
      WHERE post_id = ${post_id} AND student_name = ${student_name}
    `;
    return { acked: false };
  }

  await sql`
    INSERT INTO class_acks (post_id, student_name)
    VALUES (${post_id}, ${student_name})
    ON CONFLICT DO NOTHING
  `;
  return { acked: true };
}

/* ── 회차 상태 조회 ── */
export async function getAllSessionStatuses(): Promise<StatusesBySession> {
  const fallback: StatusesBySession = {
    1: "past",
    2: "live",
    3: "upcoming",
    4: "upcoming",
  };
  if (isMockMode || !sql) return fallback;

  const rows = (await sql`
    SELECT session_id, status FROM class_session_status
  `) as Array<{ session_id: number; status: SessionStatus }>;

  const out: StatusesBySession = { ...fallback };
  for (const r of rows) out[r.session_id] = r.status;
  return out;
}

/* ── 회차 상태 변경 (강사 전용) ── */
export async function setSessionStatus(
  session_id: number,
  status: SessionStatus
): Promise<{ success: boolean }> {
  if (isMockMode || !sql) return { success: true };

  await sql`
    INSERT INTO class_session_status (session_id, status)
    VALUES (${session_id}, ${status})
    ON CONFLICT (session_id)
    DO UPDATE SET status = EXCLUDED.status, updated_at = now()
  `;
  return { success: true };
}

/* ── 회차 메타(제목/부제/레슨) 오버라이드 전체 조회 ── */
export async function getAllSessionMetaOverrides(): Promise<OverridesBySession> {
  const fallback: OverridesBySession = { 1: {}, 2: {}, 3: {}, 4: {} };
  if (isMockMode || !sql) return fallback;

  const rows = (await sql`
    SELECT session_id, title, subtitle, lessons
    FROM class_session_meta
  `) as Array<{
    session_id: number;
    title: string | null;
    subtitle: string | null;
    lessons: Lesson[] | null;
  }>;

  const out: OverridesBySession = { ...fallback };
  for (const r of rows) {
    out[r.session_id] = {
      title: r.title,
      subtitle: r.subtitle,
      lessons: r.lessons,
    };
  }
  return out;
}

/* ── 회차 메타 업데이트 (강사 전용) ──
   null/undefined를 명시적으로 전달하면 해당 필드가 기본값으로 돌아감.
*/
export async function updateSessionMeta(
  session_id: number,
  data: SessionMetaOverride
): Promise<{ success: boolean }> {
  if (isMockMode || !sql) return { success: true };

  const title = data.title ?? null;
  const subtitle = data.subtitle ?? null;
  const lessons = data.lessons ?? null;

  await sql`
    INSERT INTO class_session_meta (session_id, title, subtitle, lessons)
    VALUES (${session_id}, ${title}, ${subtitle}, ${JSON.stringify(lessons)}::jsonb)
    ON CONFLICT (session_id)
    DO UPDATE SET
      title = EXCLUDED.title,
      subtitle = EXCLUDED.subtitle,
      lessons = EXCLUDED.lessons,
      updated_at = now()
  `;
  return { success: true };
}

/* ============================================================
   전체공지 팝업 (class_notice) — 단일 행 운영
   ============================================================ */
export interface Notice {
  enabled: boolean;
  eyebrow: string;
  title: string;
  body: string; // 빈 줄(\n\n)로 단락 구분
  foot_note: string;
  updated_at?: string;
}

/* 앱 레벨 기본값 — DB 미연결 환경 및 빈 행 대비 */
export const DEFAULT_NOTICE: Notice = {
  enabled: true,
  eyebrow: "NMM · CLASS 3 · 공지",
  title: "수강생 여러분, 환영합니다",
  body: `이 페이지는 솔바드 3기 수업 진행과 자료 확인을 위한 공간이에요. 상단 탭에서 각 회차로 이동하실 수 있어요.

매 수업 시작 전, 이곳에 그날 배울 내용과 준비물이 올라갑니다. 접속하시면 이 공지부터 먼저 확인해 주세요.

궁금한 점은 단톡방에 편하게 남겨주세요. 어렵지 않아요. 오늘도 랄랄라 클로드~`,
  foot_note: "",
};

/* 구버전 기본 본문 — 마이그레이션 대상. 커스터마이징된 내용은 건드리지 않음 */
const LEGACY_DEFAULT_BODY = `이 페이지는 솔바드 3기 수업 진행과 자료 확인을 위한 공간이에요. 상단 탭에서 각 회차로 이동하실 수 있어요.

매 수업 시작 전, 이곳에 그날 배울 내용과 준비물이 올라갑니다. 접속하시면 이 공지부터 먼저 확인해 주세요.

궁금한 점은 단톡방에 편하게 남겨주세요. 어렵지 않아요. 여러분도 할 수 있어요.`;

/* mock용 인메모리 — DB 미연결 시 런타임 편집 반영 */
let mockNotice: Notice = { ...DEFAULT_NOTICE };

/* ── 자동 마이그레이션 ──
   운영자가 수동 SQL을 돌릴 수 없는 상황 대비:
   첫 조회 시 class_notice 테이블이 없으면 생성하고 기본 행을 심는다.
   프로세스당 1회만 실행 (ensurePromise 캐싱) → 부하 無.
*/
let ensurePromise: Promise<void> | null = null;

async function ensureNoticeTable(): Promise<void> {
  if (isMockMode || !sql) return;
  if (ensurePromise) return ensurePromise;

  ensurePromise = (async () => {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS class_notice (
          id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
          enabled BOOLEAN NOT NULL DEFAULT TRUE,
          eyebrow TEXT NOT NULL DEFAULT 'NMM · CLASS 3 · 공지',
          title TEXT NOT NULL DEFAULT '수강생 여러분, 환영합니다',
          body TEXT NOT NULL DEFAULT '',
          foot_note TEXT NOT NULL DEFAULT '',
          updated_at TIMESTAMPTZ DEFAULT now()
        )
      `;
      /* 기본 행이 없으면 한 번만 심기 — 이미 있으면 유지(덮어쓰기 금지) */
      await sql`
        INSERT INTO class_notice (id, enabled, eyebrow, title, body, foot_note)
        VALUES (
          1,
          ${DEFAULT_NOTICE.enabled},
          ${DEFAULT_NOTICE.eyebrow},
          ${DEFAULT_NOTICE.title},
          ${DEFAULT_NOTICE.body},
          ${DEFAULT_NOTICE.foot_note}
        )
        ON CONFLICT (id) DO NOTHING
      `;
      /* 구버전 기본 본문을 쓰고 있으면(=관리자가 아직 편집 안 했으면) 새 기본값으로 자동 교체.
         관리자가 수정한 내용은 절대 건드리지 않는다 — body 완전일치 비교로만 트리거. */
      await sql`
        UPDATE class_notice
        SET body = ${DEFAULT_NOTICE.body}, updated_at = now()
        WHERE id = 1 AND body = ${LEGACY_DEFAULT_BODY}
      `;
    } catch (e) {
      /* 실패해도 앱 전체가 죽지 않도록 — 다음 호출 때 재시도 */
      ensurePromise = null;
      console.error("[ensureNoticeTable]", e);
      throw e;
    }
  })();

  return ensurePromise;
}

export async function getNotice(): Promise<Notice> {
  if (isMockMode || !sql) return { ...mockNotice };

  try {
    await ensureNoticeTable();
    const rows = (await sql`
      SELECT enabled, eyebrow, title, body, foot_note, updated_at::text
      FROM class_notice
      WHERE id = 1
      LIMIT 1
    `) as Array<Notice>;

    if (rows.length === 0) return { ...DEFAULT_NOTICE };
    return rows[0];
  } catch (e) {
    /* 테이블 생성/조회 완전 실패 시 기본값으로 폴백 — 페이지는 계속 뜨게 */
    console.error("[getNotice fallback]", e);
    return { ...DEFAULT_NOTICE };
  }
}

export async function updateNotice(
  data: Partial<Omit<Notice, "updated_at">>
): Promise<Notice> {
  if (isMockMode || !sql) {
    mockNotice = { ...mockNotice, ...data };
    return { ...mockNotice };
  }

  await ensureNoticeTable();

  /* 부분 업데이트 — 전달된 필드만 덮어씀 */
  await sql`
    INSERT INTO class_notice (id, enabled, eyebrow, title, body, foot_note)
    VALUES (
      1,
      ${data.enabled ?? true},
      ${data.eyebrow ?? DEFAULT_NOTICE.eyebrow},
      ${data.title ?? DEFAULT_NOTICE.title},
      ${data.body ?? DEFAULT_NOTICE.body},
      ${data.foot_note ?? ""}
    )
    ON CONFLICT (id) DO UPDATE SET
      enabled   = COALESCE(${data.enabled ?? null}, class_notice.enabled),
      eyebrow   = COALESCE(${data.eyebrow ?? null}, class_notice.eyebrow),
      title     = COALESCE(${data.title ?? null}, class_notice.title),
      body      = COALESCE(${data.body ?? null}, class_notice.body),
      foot_note = COALESCE(${data.foot_note ?? null}, class_notice.foot_note),
      updated_at = now()
  `;
  return getNotice();
}

/* ── 날짜 포맷: "04.18 10:00" (KST 고정) ──
   Vercel 서버리스 런타임은 UTC이므로 Date의 getHours() 등을 그대로 쓰면
   한국 시간에서 9시간 밀림. Intl API로 Asia/Seoul 강제 지정.
*/
function formatPostedAt(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("month")}.${get("day")} ${get("hour")}:${get("minute")}`;
}
