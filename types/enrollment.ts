/* ── 수강 신청 관련 타입 정의 ── */

/* 관심 트랙 종류 */
export type Track = "youtube" | "startup" | "automation";

/* 클로드 사용 경험 수준 */
export type Experience = "beginner" | "intermediate" | "advanced";

/* 결제 상태 */
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

/* 결제 방법 */
export type PaymentMethod = "카드" | "계좌이체" | "간편결제";

/* 수강 신청 데이터 (DB 레코드) */
export interface Enrollment {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  track: Track | null;
  experience: Experience | null;
  goal: string | null;
  order_id: string;
  payment_key: string | null;
  amount: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | null;
  paid_at: string | null;
  cohort: number;
  notes: string | null;
}

/* 신청 폼 입력 데이터 */
export interface EnrollmentFormData {
  name: string;
  email: string;
  phone: string;
  track: Track;
  experience?: Experience;
  goal?: string;
}

/* 신청 API 응답 */
export interface EnrollmentResponse {
  success: boolean;
  orderId?: string;
  message?: string;
}

/* 잔여석 조회 API 응답 */
export interface SeatCountResponse {
  total: number;
  enrolled: number;
  remaining: number;
}

/* 결제 승인 요청 */
export interface PaymentConfirmRequest {
  orderId: string;
  paymentKey: string;
  amount: number;
}
