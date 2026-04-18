import { NextResponse } from "next/server";
import {
  updateSessionMeta,
  type Lesson,
} from "@/lib/class-manage-db";

function checkAdmin(request: Request): boolean {
  const adminKey = request.headers.get("x-admin-key") || "";
  return adminKey === process.env.ADMIN_PASSWORD;
}

/* ── PATCH: 회차 메타(제목/부제/레슨) 수정 (강사 전용) ── */
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
    const session_id = Number(id);
    if (!session_id || session_id < 1 || session_id > 4) {
      return NextResponse.json(
        { success: false, message: "잘못된 회차" },
        { status: 400 }
      );
    }

    const body = (await request.json()) as {
      title?: string | null;
      subtitle?: string | null;
      lessons?: Lesson[] | null;
    };

    /* 레슨 기본 검증 */
    if (body.lessons != null) {
      if (!Array.isArray(body.lessons) || body.lessons.length === 0) {
        return NextResponse.json(
          { success: false, message: "레슨은 최소 1개 이상" },
          { status: 400 }
        );
      }
      for (const l of body.lessons) {
        if (
          typeof l.n !== "number" ||
          typeof l.title !== "string" ||
          !l.title.trim() ||
          typeof l.mins !== "number" ||
          l.mins < 0
        ) {
          return NextResponse.json(
            { success: false, message: "레슨 형식 확인" },
            { status: 400 }
          );
        }
      }
    }

    await updateSessionMeta(session_id, {
      title: body.title?.trim() || null,
      subtitle: body.subtitle?.trim() || null,
      lessons: body.lessons ?? null,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[manage/sessions/meta PATCH]", e);
    return NextResponse.json(
      { success: false, message: "변경 실패" },
      { status: 500 }
    );
  }
}
