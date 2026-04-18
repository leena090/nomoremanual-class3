"use client";

import { useState } from "react";
import { STUDENTS } from "../data";

export function StudentPicker({
  currentName,
  onPick,
  onClose,
}: {
  currentName: string;
  onPick: (name: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = STUDENTS.filter((s) => s.includes(query));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 480 }}
      >
        <h3>반갑습니다 👋</h3>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          본인 이름을 한 번만 선택해두시면 이후엔 바로 확인 버튼을 누르실 수 있어요.
        </p>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 이름 검색"
          style={{ marginBottom: 12 }}
          autoFocus
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: 8,
            maxHeight: 360,
            overflowY: "auto",
          }}
        >
          {filtered.map((s) => (
            <button
              key={s}
              className={`student-pick ${s === currentName ? "is-current" : ""}`}
              onClick={() => onPick(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="modal__foot">
          <button className="btn btn--ghost" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminPasswordModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (key: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        onSuccess(password);
      } else {
        setErr(data.message || "비밀번호가 일치하지 않습니다");
      }
    } catch {
      setErr("서버 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 420 }}
      >
        <h3>관리자 모드 🔐</h3>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          강사 전용입니다. 비밀번호를 입력해주세요.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) submit();
          }}
          placeholder="비밀번호"
          autoFocus
        />
        {err && (
          <div
            style={{
              color: "var(--color-error)",
              fontSize: 13,
              marginTop: 8,
            }}
          >
            {err}
          </div>
        )}
        <div className="modal__foot">
          <button className="btn btn--ghost" onClick={onClose}>
            취소
          </button>
          <button
            className="btn btn--primary"
            disabled={loading || !password}
            onClick={submit}
          >
            {loading ? "확인 중…" : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}
