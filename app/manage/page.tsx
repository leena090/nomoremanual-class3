import {
  getAllPosts,
  getAllAcks,
  getAllSessionStatuses,
} from "@/lib/class-manage-db";
import ClientShell from "./ClientShell";

export const dynamic = "force-dynamic";

/* ── 수업관리앱 진입점 (Server Component) ──
   Neon에서 posts + acks + 회차 상태 초기 로드 후 ClientShell로 전달.
*/
export default async function ManagePage() {
  const [posts, acks, statuses] = await Promise.all([
    getAllPosts(),
    getAllAcks(),
    getAllSessionStatuses(),
  ]);
  return (
    <ClientShell
      initialPosts={posts}
      initialAcks={acks}
      initialStatuses={statuses}
    />
  );
}
