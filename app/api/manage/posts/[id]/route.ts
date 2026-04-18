import { NextResponse } from "next/server";
import {
  updatePost,
  deletePost,
  type PostKind,
} from "@/lib/class-manage-db";

/* ── 관리자 인증 체크 ── */
function checkAdmin(request: Request): boolean {
  const adminKey = request.headers.get("x-admin-key") || "";
  return adminKey === process.env.ADMIN_PASSWORD;
}

/* ── PATCH: 게시글 수정 (강사 전용) ── */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json(
        { success: false, message: "권한 없음" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = (await request.json()) as {
      kind?: PostKind;
      title?: string;
      body?: string;
    };

    await updatePost(id, {
      kind: body.kind,
      title: body.title?.trim(),
      body: body.body?.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[manage/posts PATCH]", e);
    return NextResponse.json(
      { success: false, message: "수정 실패" },
      { status: 500 }
    );
  }
}

/* ── DELETE: 게시글 삭제 (강사 전용) ── */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json(
        { success: false, message: "권한 없음" },
        { status: 401 }
      );
    }

    const { id } = await params;
    await deletePost(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[manage/posts DELETE]", e);
    return NextResponse.json(
      { success: false, message: "삭제 실패" },
      { status: 500 }
    );
  }
}
