import { NextResponse } from "next/server";

/* ── POST: 관리자 비밀번호 인증 API ── */
export async function POST(request: Request) {
  try {
    /* 요청 바디에서 비밀번호 추출 */
    const body = await request.json();
    const { password } = body;

    /* 환경변수에 설정된 관리자 비밀번호와 비교 */
    const adminPassword = process.env.ADMIN_PASSWORD;

    /* 관리자 비밀번호가 환경변수에 설정되지 않은 경우 */
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD 환경변수가 설정되지 않았습니다.");
      return NextResponse.json(
        { success: false, message: "서버 설정 오류입니다." },
        { status: 500 }
      );
    }

    /* 비밀번호 일치 여부 확인 */
    if (password === adminPassword) {
      /* 인증 성공 */
      return NextResponse.json({ success: true });
    }

    /* 인증 실패: 비밀번호 불일치 */
    return NextResponse.json(
      { success: false, message: "비밀번호가 일치하지 않습니다." },
      { status: 401 }
    );
  } catch (error) {
    /* 예상치 못한 에러 처리 */
    console.error("관리자 인증 API 오류:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
