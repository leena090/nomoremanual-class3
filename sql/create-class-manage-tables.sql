-- ============================================
-- 솔바드 3기 수업관리앱 — DB 스키마
-- 게시판(class_posts) + 확인(class_acks)
-- ============================================

/* ── 게시글 테이블 ─────────────────────────────
   강사가 1~4강 각 회차별로 올리는 수업내용/과제/공지
   id: 'p{session_id}-{timestamp}' 형태의 문자열 ID
*/
CREATE TABLE IF NOT EXISTS class_posts (
  id TEXT PRIMARY KEY,
  session_id INT NOT NULL CHECK (session_id BETWEEN 1 AND 4),
  kind TEXT NOT NULL CHECK (kind IN ('recap', 'assignment', 'notice')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  posted_at TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_class_posts_session ON class_posts(session_id);
CREATE INDEX IF NOT EXISTS idx_class_posts_created ON class_posts(created_at);

/* ── 확인 테이블 ──────────────────────────────
   학생이 게시글에 "확인했어요" 누른 기록
   (post_id, student_name) 조합이 unique
*/
CREATE TABLE IF NOT EXISTS class_acks (
  post_id TEXT NOT NULL REFERENCES class_posts(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  acked_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (post_id, student_name)
);

CREATE INDEX IF NOT EXISTS idx_class_acks_post ON class_acks(post_id);
CREATE INDEX IF NOT EXISTS idx_class_acks_student ON class_acks(student_name);

/* ── 전체공지 팝업 테이블 ───────────────────────
   단일 행(id=1) 운영 — 관리자가 수업페이지 진입 시 노출되는 공지 편집
*/
CREATE TABLE IF NOT EXISTS class_notice (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  eyebrow TEXT NOT NULL DEFAULT 'NMM · CLASS 3 · 공지',
  title TEXT NOT NULL DEFAULT '수강생 여러분, 환영합니다',
  body TEXT NOT NULL DEFAULT '',
  foot_note TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

/* 초기 단일 행 삽입 (이미 있으면 유지) */
INSERT INTO class_notice (id, enabled, eyebrow, title, body, foot_note)
VALUES (
  1,
  TRUE,
  'NMM · CLASS 3 · 공지',
  '수강생 여러분, 환영합니다',
  '이 페이지는 솔바드 3기 수업 진행과 자료 확인을 위한 공간이에요. 상단 탭에서 각 회차로 이동하실 수 있어요.

매 수업 시작 전, 이곳에 그날 배울 내용과 준비물이 올라갑니다. 접속하시면 이 공지부터 먼저 확인해 주세요.

궁금한 점은 단톡방에 편하게 남겨주세요. 어렵지 않아요. 여러분도 할 수 있어요.',
  ''
)
ON CONFLICT (id) DO NOTHING;
