"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AcksByPost,
  ActiveView,
  Accent,
  Density,
  Layout,
  ManageState,
  Mode,
  Post,
  PostKind,
  PostsBySession,
  SessionStatus,
  StatusesBySession,
} from "./types";
import { Topbar, SideNav } from "./components/Topbar";
import { SessionPage } from "./components/SessionPage";
import { Dashboard, StudentsPage } from "./components/Dashboard";
import { TweaksPanel, Toast } from "./components/TweaksPanel";
import { StudentPicker, AdminPasswordModal } from "./components/StudentPicker";

interface Props {
  initialPosts: PostsBySession;
  initialAcks: AcksByPost;
  initialStatuses: StatusesBySession;
}

/* ── localStorage 키 네임스페이스 ── */
const LS = {
  mode: "manage:mode",
  active: "manage:active",
  student: "manage:studentName",
  adminKey: "manage:adminKey",
  layout: "manage:layout",
  accent: "manage:accent",
  density: "manage:density",
} as const;

function lsGet(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return window.localStorage.getItem(key) || fallback;
}

export default function ClientShell({
  initialPosts,
  initialAcks,
  initialStatuses,
}: Props) {
  /* ── 서버 데이터 로컬 상태 ── */
  const [posts, setPosts] = useState<PostsBySession>(initialPosts);
  const [acks, setAcks] = useState<AcksByPost>(initialAcks);
  const [statuses, setStatuses] =
    useState<StatusesBySession>(initialStatuses);

  /* ── UI 상태 ── */
  const [mode, setMode] = useState<Mode>("student");
  const [active, setActive] = useState<ActiveView>("s2");
  const [studentName, setStudentName] = useState("");
  const [adminKey, setAdminKey] = useState("");

  const [layout, setLayout] = useState<Layout>("top");
  const [accent, setAccent] = useState<Accent>("orange");
  const [density, setDensity] = useState<Density>("comfortable");

  const [pickerOpen, setPickerOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);

  const [toast, setToast] = useState<{ show: boolean; msg: string }>({
    show: false,
    msg: "",
  });

  /* ── 초기 마운트: localStorage 복원 (SSR 안전) ── */
  useEffect(() => {
    setMode((lsGet(LS.mode, "student") as Mode) || "student");
    setActive((lsGet(LS.active, "s2") as ActiveView) || "s2");
    setStudentName(lsGet(LS.student, ""));
    setAdminKey(lsGet(LS.adminKey, ""));
    setLayout((lsGet(LS.layout, "top") as Layout) || "top");
    setAccent((lsGet(LS.accent, "orange") as Accent) || "orange");
    setDensity(
      (lsGet(LS.density, "comfortable") as Density) || "comfortable"
    );
  }, []);

  /* ── 변경 시 localStorage 저장 ── */
  useEffect(() => {
    localStorage.setItem(LS.mode, mode);
  }, [mode]);
  useEffect(() => {
    localStorage.setItem(LS.active, active);
  }, [active]);
  useEffect(() => {
    localStorage.setItem(LS.student, studentName);
  }, [studentName]);
  useEffect(() => {
    localStorage.setItem(LS.adminKey, adminKey);
  }, [adminKey]);
  useEffect(() => {
    localStorage.setItem(LS.layout, layout);
  }, [layout]);
  useEffect(() => {
    localStorage.setItem(LS.accent, accent);
  }, [accent]);
  useEffect(() => {
    localStorage.setItem(LS.density, density);
  }, [density]);

  /* ── 학생 모드 + 이름 없음 → 자동 picker ── */
  useEffect(() => {
    if (mode === "student" && !studentName && !pickerOpen) {
      const t = setTimeout(() => setPickerOpen(true), 500);
      return () => clearTimeout(t);
    }
  }, [mode, studentName, pickerOpen]);

  /* ── 토스트 ── */
  const showToast = useCallback((msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2400);
  }, []);

  /* ── 서버와 동기화된 mutation 헬퍼 ── */
  const refetchPosts = useCallback(async () => {
    const res = await fetch("/api/manage/posts");
    const data = await res.json();
    if (data.success) setPosts(data.posts);
  }, []);

  const refetchAcks = useCallback(async () => {
    const res = await fetch("/api/manage/acks");
    const data = await res.json();
    if (data.success) setAcks(data.acks);
  }, []);

  const actions = useMemo(
    () => ({
      async addPost(
        sessionId: number,
        data: { kind: PostKind; title: string; body: string }
      ) {
        const res = await fetch("/api/manage/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify({ session_id: sessionId, ...data }),
        });
        const result = await res.json();
        if (!result.success) {
          showToast(result.message || "등록 실패");
          return;
        }
        const post: Post = result.post;
        setPosts((prev) => ({
          ...prev,
          [sessionId]: [...(prev[sessionId] || []), post],
        }));
      },
      async updatePost(
        sessionId: number,
        postId: string,
        data: { kind: PostKind; title: string; body: string }
      ) {
        const res = await fetch(`/api/manage/posts/${postId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!result.success) {
          showToast(result.message || "수정 실패");
          return;
        }
        setPosts((prev) => ({
          ...prev,
          [sessionId]: (prev[sessionId] || []).map((p) =>
            p.id === postId ? { ...p, ...data } : p
          ),
        }));
      },
      async deletePost(sessionId: number, postId: string) {
        const res = await fetch(`/api/manage/posts/${postId}`, {
          method: "DELETE",
          headers: { "x-admin-key": adminKey },
        });
        const result = await res.json();
        if (!result.success) {
          showToast(result.message || "삭제 실패");
          return;
        }
        setPosts((prev) => ({
          ...prev,
          [sessionId]: (prev[sessionId] || []).filter((p) => p.id !== postId),
        }));
        setAcks((prev) => {
          const n = { ...prev };
          delete n[postId];
          return n;
        });
      },
      async setSessionStatus(session_id: number, status: SessionStatus) {
        /* 낙관적 업데이트 */
        const prev = statuses[session_id];
        setStatuses((s) => ({ ...s, [session_id]: status }));
        const res = await fetch(`/api/manage/sessions/${session_id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify({ status }),
        });
        const result = await res.json();
        if (!result.success) {
          setStatuses((s) => ({ ...s, [session_id]: prev }));
          showToast(result.message || "상태 변경 실패");
        } else {
          showToast("상태 변경 완료");
        }
      },
      async toggleAck(postId: string, name: string) {
        if (!name) return;
        /* 낙관적 업데이트 — 즉각 반영 */
        const prevList = acks[postId] || [];
        const has = prevList.includes(name);
        const optimistic = has
          ? prevList.filter((n) => n !== name)
          : [...prevList, name];
        setAcks((prev) => ({ ...prev, [postId]: optimistic }));

        const res = await fetch("/api/manage/acks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post_id: postId, student_name: name }),
        });
        const result = await res.json();
        if (!result.success) {
          /* 실패 시 롤백 */
          setAcks((prev) => ({ ...prev, [postId]: prevList }));
          showToast(result.message || "처리 실패");
        }
      },
    }),
    [adminKey, acks, statuses, showToast]
  );

  /* ── 주기적 ack 동기화 (30초) — 다른 학생 확인 현황 반영 ── */
  useEffect(() => {
    const iv = setInterval(() => {
      refetchAcks();
      refetchPosts();
    }, 30_000);
    return () => clearInterval(iv);
  }, [refetchAcks, refetchPosts]);

  const state: ManageState = { posts, acks, statuses };

  let page: React.ReactNode = null;
  if (active === "dashboard") {
    page = <Dashboard state={state} setActive={setActive} />;
  } else if (active === "students") {
    page = <StudentsPage state={state} />;
  } else if (active.startsWith("s")) {
    const id = Number(active.slice(1));
    page = (
      <SessionPage
        sessionId={id}
        mode={mode}
        state={state}
        actions={actions}
        showToast={showToast}
        studentName={studentName}
        onPickStudent={() => setPickerOpen(true)}
      />
    );
  }

  return (
    <div
      className="manage-shell"
      data-layout={layout}
      data-accent={accent}
      data-density={density}
    >
      <Topbar
        mode={mode}
        setMode={setMode}
        active={active}
        setActive={setActive}
        studentName={studentName}
        onPickStudent={() => setPickerOpen(true)}
        onRequestAdmin={() => {
          if (adminKey) {
            /* 이미 인증됨 */
            setMode("admin");
          } else {
            setAdminModalOpen(true);
          }
        }}
      />
      <main className="layout">
        {layout === "side" && <SideNav active={active} setActive={setActive} />}
        <div>{page}</div>
      </main>
      <Toast msg={toast.msg} show={toast.show} />
      <TweaksPanel
        open={tweaksOpen}
        setOpen={setTweaksOpen}
        layout={layout}
        setLayout={setLayout}
        accent={accent}
        setAccent={setAccent}
        density={density}
        setDensity={setDensity}
      />
      {pickerOpen && (
        <StudentPicker
          currentName={studentName}
          onClose={() => setPickerOpen(false)}
          onPick={(name) => {
            setStudentName(name);
            setPickerOpen(false);
            showToast(`${name}님, 환영합니다 👋`);
          }}
        />
      )}
      {adminModalOpen && (
        <AdminPasswordModal
          onClose={() => setAdminModalOpen(false)}
          onSuccess={(key) => {
            setAdminKey(key);
            setMode("admin");
            setAdminModalOpen(false);
            showToast("관리자 모드로 전환되었습니다");
          }}
        />
      )}
    </div>
  );
}
