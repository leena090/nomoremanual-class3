import { neon } from "@neondatabase/serverless";

/* ── Neon Postgres 클라이언트 초기화 ── */
const DATABASE_URL = process.env.DATABASE_URL || "";

/* Mock 모드 여부 (환경변수 미설정 시 true) */
export const isMockMode = !DATABASE_URL || DATABASE_URL === "";

/* SQL 쿼리 실행 함수 */
export const sql = isMockMode ? null : neon(DATABASE_URL);

/* ── 신청 데이터 삽입 ── */
export async function insertEnrollment(data: {
  name: string;
  email: string;
  phone: string;
  track: string;
  experience: string | null;
  goal: string | null;
  order_id: string;
  amount: number;
  cohort: number;
}) {
  /* Mock 모드: 콘솔에 로그만 출력 */
  if (isMockMode || !sql) {
    console.log("[MOCK] 수강 신청 접수:", data);
    return { success: true, mock: true };
  }

  /* 실제 DB에 데이터 삽입 */
  await sql`
    INSERT INTO enrollments (name, email, phone, track, experience, goal, order_id, amount, payment_status, cohort)
    VALUES (${data.name}, ${data.email}, ${data.phone}, ${data.track}, ${data.experience}, ${data.goal}, ${data.order_id}, ${data.amount}, 'pending', ${data.cohort})
  `;

  return { success: true };
}

/* ── 신청자 목록 조회 ── */
export async function getEnrollments(statusFilter?: string) {
  if (isMockMode || !sql) {
    return [];
  }

  if (statusFilter && statusFilter !== "all") {
    /* 특정 결제 상태로 필터링 */
    const rows = await sql`
      SELECT * FROM enrollments
      WHERE payment_status = ${statusFilter}
      ORDER BY created_at DESC
    `;
    return rows;
  }

  /* 전체 조회 (최신순) */
  const rows = await sql`
    SELECT * FROM enrollments ORDER BY created_at DESC
  `;
  return rows;
}

/* ── 결제 완료 처리 ── */
export async function updatePaymentStatus(
  orderId: string,
  status: string,
  paymentKey?: string,
  paymentMethod?: string
) {
  if (isMockMode || !sql) {
    console.log("[MOCK] 결제 상태 업데이트:", { orderId, status });
    return { success: true, mock: true };
  }

  await sql`
    UPDATE enrollments
    SET payment_status = ${status},
        payment_key = ${paymentKey || null},
        payment_method = ${paymentMethod || null},
        paid_at = NOW()
    WHERE order_id = ${orderId}
  `;

  return { success: true };
}

/* ── 완료된 신청자 수 조회 (잔여석 계산용) ── */
export async function getCompletedCount(): Promise<number> {
  if (isMockMode || !sql) {
    return 0;
  }

  const rows = await sql`
    SELECT COUNT(*) as count FROM enrollments WHERE payment_status = 'completed'
  `;
  return Number(rows[0]?.count || 0);
}
