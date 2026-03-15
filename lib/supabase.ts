import { createClient } from "@supabase/supabase-js";

/* ── Supabase URL / Key 가져오기 ── */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/* Mock 모드 여부 (환경변수 미설정 시 true) */
export const isMockMode =
  !supabaseUrl || supabaseUrl === "https://your-project.supabase.co";

/* 일반 클라이언트 (anon key — 브라우저/프론트엔드용) */
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

/* 관리자 클라이언트 (service_role key — API Route 서버측에서만 사용) */
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceKey || "placeholder-key"
);
