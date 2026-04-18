import { NextResponse } from "next/server";
import { getAllAcks, toggleAck } from "@/lib/class-manage-db";
import { STUDENTS } from "@/app/manage/data";

/* ── GET: 전체 확인 현황 (공개) ── */
export async function GET() {
  try {
    const acks = await getAllAcks();
    return NextResponse.json({ success: true, acks });
  } catch (e) {
    console.error("[manage/acks GET]", e);
    return NextResponse.json(
      { success: false, message: "조회 실패" },
      { status: 500 }
    );
  }
}

/* ── POST: 확인 토글 (학생) ──
   name은 STUDENTS 배열에 포함된 이름만 허용.
*/
export async function POST(request: Request) {
  try {
    const { post_id, student_name } = (await request.json()) as {
      post_id: string;
      student_name: string;
    };

    if (!post_id || !student_name) {
      return NextResponse.json(
        { success: false, message: "입력값 확인" },
        { status: 400 }
      );
    }

    /* 허용 목록 검증 — 엉뚱한 이름 방지 */
    if (!STUDENTS.includes(student_name)) {
      return NextResponse.json(
        { success: false, message: "등록된 수강생이 아닙니다" },
        { status: 400 }
      );
    }

    const result = await toggleAck(post_id, student_name);
    return NextResponse.json({ success: true, ...result });
  } catch (e) {
    console.error("[manage/acks POST]", e);
    return NextResponse.json(
      { success: false, message: "처리 실패" },
      { status: 500 }
    );
  }
}
