import {
  getAllPosts,
  getAllAcks,
  getAllSessionStatuses,
  getAllSessionMetaOverrides,
} from "@/lib/class-manage-db";
import { mergeSessions } from "./data";
import ClientShell from "./ClientShell";

export const dynamic = "force-dynamic";

/* ── 수업관리앱 진입점 (Server Component) ──
   Neon에서 posts + acks + 회차 상태 + 회차 메타 오버라이드 로드.
*/
export default async function ManagePage() {
  const [posts, acks, statuses, overrides] = await Promise.all([
    getAllPosts(),
    getAllAcks(),
    getAllSessionStatuses(),
    getAllSessionMetaOverrides(),
  ]);
  const sessions = mergeSessions(overrides);
  return (
    <ClientShell
      initialPosts={posts}
      initialAcks={acks}
      initialStatuses={statuses}
      initialSessions={sessions}
    />
  );
}
