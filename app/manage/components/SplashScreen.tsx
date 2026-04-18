"use client";

/* ── 최초 진입 역할 선택 스플래시 ──
   "학생으로 시작" / "관리자로 시작" 좌우 대칭 큰 버튼.
   한 번 선택하면 localStorage에 저장되어 재방문 시 건너뜀.
*/
export function SplashScreen({
  savedStudentName,
  hasAdminKey,
  onPickStudent,
  onPickAdmin,
}: {
  savedStudentName: string;
  hasAdminKey: boolean;
  onPickStudent: () => void;
  onPickAdmin: () => void;
}) {
  return (
    <div className="splash">
      <div className="splash__inner">
        <div className="splash__brand">
          <div className="splash__mark">솔</div>
          <div className="splash__title">솔바드 3기 수업관리</div>
          <div className="splash__sub">
            어떤 모드로 들어오셨나요? 아래에서 선택해주세요.
          </div>
        </div>

        <div className="splash__choices">
          <button
            className="splash__choice splash__choice--student"
            onClick={onPickStudent}
          >
            <div className="splash__choice-icon" aria-hidden>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="splash__choice-label">수강생</div>
            <div className="splash__choice-desc">
              {savedStudentName
                ? `${savedStudentName}님, 바로 들어가기`
                : "수업 확인하러 왔어요"}
            </div>
          </button>

          <button
            className="splash__choice splash__choice--admin"
            onClick={onPickAdmin}
          >
            <div className="splash__choice-icon" aria-hidden>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
              </svg>
            </div>
            <div className="splash__choice-label">관리자</div>
            <div className="splash__choice-desc">
              {hasAdminKey ? "바로 들어가기" : "강사 전용 · 비밀번호 필요"}
            </div>
          </button>
        </div>

        <div className="splash__footer">
          NoMoreManual · Class 3 · 솔바드
        </div>
      </div>
    </div>
  );
}
