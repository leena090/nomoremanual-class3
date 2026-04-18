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

/* ── 날짜 포맷: "04.18 10:00" ── */
function formatPostedAt(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${mm}.${dd} ${hh}:${mi}`;
}
