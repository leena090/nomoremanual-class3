-- ============================================
-- 노모어매뉴얼 클로드 마스터클래스 2기 DB 스키마
-- ============================================

CREATE TABLE enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- 수강생 정보
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- 선택 정보 (신청 폼)
  track TEXT,            -- 'youtube' | 'startup' | 'automation'
  experience TEXT,       -- 클로드 사용 경험 수준
  goal TEXT,             -- 수강 목표 (자유 입력)

  -- 결제 정보
  order_id TEXT UNIQUE NOT NULL,
  payment_key TEXT,
  amount INTEGER NOT NULL DEFAULT 385000,
  payment_status TEXT DEFAULT 'pending',  -- 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method TEXT,   -- '카드' | '계좌이체' | '간편결제'
  paid_at TIMESTAMPTZ,

  -- 메타
  cohort INTEGER DEFAULT 2,  -- 기수
  notes TEXT
);

-- 인덱스
CREATE INDEX idx_enrollments_status ON enrollments(payment_status);
CREATE INDEX idx_enrollments_email ON enrollments(email);

-- RLS (Row Level Security)
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- anon 키: INSERT만 허용 (신청 폼 제출용)
CREATE POLICY "Allow anonymous insert" ON enrollments
  FOR INSERT TO anon WITH CHECK (true);
