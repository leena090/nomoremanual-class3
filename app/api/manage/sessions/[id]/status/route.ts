import { NextResponse } from "next/server";
import {
  setSessionStatus,
  type SessionStatus,
} from "@/lib/class-manage-db";

function checkAdmin(request: Request): boolean {
  const adminKey = request.headers.get("x-admin-key") || "";
  return adminKey === process.env.ADMIN_PASSWORD;
}

/* ── PATCH: 회차 상태 변경 (강사 전용) ── */
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

    const body = (await request.json()) as { status: SessionStatus };
    if (!["past", "live", "upcoming"].includes(body.status)) {
      return NextResponse.json(
        { success: false, message: "잘못된 상태값" },
        { status: 400 }
      );
    }

    await setSessionStatus(session_id, body.status);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[manage/sessions/status PATCH]", e);
    return NextResponse.json(
      { success: false, message: "변경 실패" },
      { status: 500 }
    );
  }
}
