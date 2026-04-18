import { NextResponse } from "next/server";
import {
  getAllPosts,
  createPost,
  type PostKind,
} from "@/lib/class-manage-db";

/* ── GET: 전체 게시글 조회 (공개) ── */
export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json({ success: true, posts });
  } catch (e) {
    console.error("[manage/posts GET]", e);
    return NextResponse.json(
      { success: false, message: "조회 실패" },
      { status: 500 }
    );
  }
}

/* ── POST: 게시글 생성 (강사 전용) ──
   x-admin-key 헤더에 ADMIN_PASSWORD 일치해야 함.
*/
export async function POST(request: Request) {
  try {
    const adminKey = request.headers.get("x-admin-key") || "";
    if (adminKey !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "권한 없음" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as {
      session_id: number;
      kind: PostKind;
      title: string;
      body: string;
    };

    /* 기본 검증 */
    if (
      !body.session_id ||
      body.session_id < 1 ||
      body.session_id > 4 ||
      !["recap", "assignment", "notice"].includes(body.kind) ||
      !body.title?.trim() ||
      !body.body?.trim()
    ) {
      return NextResponse.json(
        { success: false, message: "입력값 확인" },
        { status: 400 }
      );
    }

    const post = await createPost({
      session_id: body.session_id,
      kind: body.kind,
      title: body.title.trim(),
      body: body.body.trim(),
    });

    return NextResponse.json({ success: true, post });
  } catch (e) {
    console.error("[manage/posts POST]", e);
    return NextResponse.json(
      { success: false, message: "생성 실패" },
      { status: 500 }
    );
  }
}
