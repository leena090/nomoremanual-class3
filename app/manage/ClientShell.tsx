"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AcksByPost,
  ActiveView,
  Accent,
  Density,
  Layout,
  Lesson,
  ManageState,
  Mode,
  Post,
  PostKind,
  PostsBySession,
  SessionMeta,
  SessionStatus,
  StatusesBySession,
} from "./types";
import { Topbar, SideNav } from "./components/Topbar";
import { SessionPage } from "./components/SessionPage";
import { Dashboard, StudentsPage } from "./components/Dashboard";
import { TweaksPanel, Toast } from "./components/TweaksPanel";
import { StudentPicker, AdminPasswordModal } from "./components/StudentPicker";
import { SplashScreen } from "./components/SplashScreen";

interface Props {
  initialPosts: PostsBySession;
  initialAcks: AcksByPost;
  initialStatuses: StatusesBySession;
  initialSessions: SessionMeta[];
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
  initialSessions,
}: Props) {
  /* ── 서버 데이터 로컬 상태 ── */
  const [posts, setPosts] = useState<PostsBySession>(initialPosts);
  const [acks, setAcks] = useState<AcksByPost>(initialAcks);
  const [statuses, setStatuses] =
    useState<StatusesBySession>(initialStatuses);
  const [sessions, setSessions] = useState<SessionMeta[]>(initialSessions);

  /* ── UI 상태 ── */
  const [mode, setMode] = useState<Mode>("admin");
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

  /* ── 스플래시 노출 여부 (null = SSR 단계, 마운트 후 결정) ── */
  const [splashOpen, setSplashOpen] = useState<boolean | null>(null);

  /* ── 초기 마운트: localStorage 복원. 대문은 매번 노출. ── */
  useEffect(() => {
    setActive((lsGet(LS.active, "s2") as ActiveView) || "s2");
    setStudentName(lsGet(LS.student, ""));
    setAdminKey(lsGet(LS.adminKey, ""));
    setLayout((lsGet(LS.layout, "top") as Layout) || "top");
    setAccent((lsGet(LS.accent, "orange") as Accent) || "orange");
    setDensity(
      (lsGet(LS.density, "comfortable") as Density) || "comfortable"
    );
    /* 대문(스플래시)은 항상 처음에 노출. 저장된 이름/비번이 있으면
       버튼 한 번 클릭만으로 바로 진입 (비번 재입력 없음). */
    setSplashOpen(true);
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

  /* 순수 학생(관리자 권한 없음)만 학생 모드 전환 시 picker 자동 열림.
     관리자는 학생 뷰 미리보기 상태라 이름 강요하지 않음. */
  useEffect(() => {
    if (
      splashOpen === false &&
      mode === "student" &&
      !studentName &&
      !pickerOpen &&
      !adminKey
    ) {
      setPickerOpen(true);
    }
  }, [mode, studentName, pickerOpen, splashOpen, adminKey]);

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
      async updateSessionMeta(
        session_id: number,
        data: { title: string; subtitle: string; lessons: Lesson[] }
      ) {
        const prev = sessions;
        /* 낙관적 업데이트 */
        setSessions((arr) =>
          arr.map((s) =>
            s.id === session_id
              ? { ...s, title: data.title, subtitle: data.subtitle, lessons: data.lessons }
              : s
          )
        );
        const res = await fetch(`/api/manage/sessions/${session_id}/meta`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!result.success) {
          setSessions(prev);
          showToast(result.message || "수정 실패");
        } else {
          showToast("수업 구성 수정 완료");
        }
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
    [adminKey, acks, statuses, sessions, showToast]
  );

  /* ── 주기적 ack 동기화 (30초) — 다른 학생 확인 현황 반영 ── */
  useEffect(() => {
    const iv = setInterval(() => {
      refetchAcks();
      refetchPosts();
    }, 30_000);
    return () => clearInterval(iv);
  }, [refetchAcks, refetchPosts]);

  const state: ManageState = { posts, acks, statuses, sessions };

  /* ── SSR 초기 프레임: 아무것도 렌더하지 않아 깜빡임 방지 ── */
  if (splashOpen === null) {
    return (
      <div
        className="manage-shell"
        data-layout={layout}
        data-accent={accent}
        data-density={density}
        style={{ minHeight: "100vh" }}
      />
    );
  }

  /* ── 스플래시: 최초 진입 역할 선택 ── */
  if (splashOpen) {
    return (
      <div
        className="manage-shell"
        data-layout={layout}
        data-accent={accent}
        data-density={density}
      >
        <SplashScreen
          savedStudentName={studentName}
          hasAdminKey={!!adminKey}
          onPickStudent={() => {
            setMode("student");
            setSplashOpen(false);
            /* 저장된 이름 있거나 관리자 권한 있으면 picker 건너뜀.
               관리자는 이름 없이도 학생 뷰 미리보기 가능. */
            if (!studentName && !adminKey) setPickerOpen(true);
          }}
          onPickAdmin={() => {
            if (adminKey) {
              setMode("admin");
              setSplashOpen(false);
            } else {
              setAdminModalOpen(true);
            }
          }}
        />
        {adminModalOpen && (
          <AdminPasswordModal
            onClose={() => setAdminModalOpen(false)}
            onSuccess={(key) => {
              setAdminKey(key);
              setMode("admin");
              setAdminModalOpen(false);
              setSplashOpen(false);
              showToast("관리자 모드로 전환되었습니다");
            }}
          />
        )}
      </div>
    );
  }

  let page: React.ReactNode = null;
  if (active === "dashboard") {
    page = (
      <Dashboard
        state={state}
        setActive={setActive}
        mode={mode}
        studentName={studentName}
      />
    );
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
        sessions={sessions}
        studentName={studentName}
        hasAdminKey={!!adminKey}
        onPickStudent={() => setPickerOpen(true)}
        onRequestAdmin={() => {
          if (adminKey) setMode("admin");
          else setAdminModalOpen(true);
        }}
      />
      <main className="layout">
        {layout === "side" && (
          <SideNav active={active} setActive={setActive} sessions={sessions} />
        )}
        <div>{page}</div>
      </main>
      <Toast msg={toast.msg} show={toast.show} />
      {/* Tweaks는 관리자 권한 있는 경우에만 노출 (학생에게는 숨김) */}
      {!!adminKey && (
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
      )}
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
