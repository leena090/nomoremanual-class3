import { NextResponse } from "next/server";
import { getNotice, updateNotice } from "@/lib/class-manage-db";

/* ── GET: 전체공지 조회 (공개) ── */
export async function GET() {
  try {
    const notice = await getNotice();
    return NextResponse.json({ success: true, notice });
  } catch (e) {
    console.error("[manage/notice GET]", e);
    return NextResponse.json(
      { success: false, message: "조회 실패" },
      { status: 500 }
    );
  }
}

/* ── PUT: 전체공지 수정 (관리자 전용) ──
   x-admin-key 헤더에 ADMIN_PASSWORD 일치 필수.
   body: { enabled?, eyebrow?, title?, body?, foot_note? }
*/
export async function PUT(request: Request) {
  try {
    const adminKey = request.headers.get("x-admin-key") || "";
    if (adminKey !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "권한 없음" },
        { status: 401 }
      );
    }

    const data = (await request.json()) as {
      enabled?: boolean;
      eyebrow?: string;
      title?: string;
      body?: string;
      foot_note?: string;
    };

    /* 최소 검증 — 제목/본문이 문자열일 때만 trim, 빈값 금지 */
    if (data.title !== undefined && !data.title.trim()) {
      return NextResponse.json(
        { success: false, message: "제목을 입력해 주세요" },
        { status: 400 }
      );
    }
    if (data.body !== undefined && !data.body.trim()) {
      return NextResponse.json(
        { success: false, message: "본문을 입력해 주세요" },
        { status: 400 }
      );
    }

    const notice = await updateNotice({
      enabled: data.enabled,
      eyebrow: data.eyebrow?.trim(),
      title: data.title?.trim(),
      body: data.body, // 본문은 줄바꿈 보존
      foot_note: data.foot_note?.trim(),
    });

    return NextResponse.json({ success: true, notice });
  } catch (e) {
    console.error("[manage/notice PUT]", e);
    return NextResponse.json(
      { success: false, message: "저장 실패" },
      { status: 500 }
    );
  }
}
