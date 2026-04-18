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
