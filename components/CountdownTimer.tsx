"use client";

import { useEffect, useState } from "react";

/**
 * 카운트다운 타이머 컴포넌트
 * - NEXT_PUBLIC_DEADLINE 환경변수에서 마감일을 읽음
 * - 기본값: 현재로부터 7일 후
 * - 1초마다 갱신하여 남은 일/시간/분 표시
 */
export default function CountdownTimer() {
  /* 마감일 계산: 환경변수 우선, 없으면 7일 후 */
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    /* 마감일 결정 */
    const envDeadline = process.env.NEXT_PUBLIC_DEADLINE;
    let deadline: Date;

    if (envDeadline) {
      deadline = new Date(envDeadline);
    } else {
      /* 환경변수 없으면 7일 후 23:59:59 */
      deadline = new Date();
      deadline.setDate(deadline.getDate() + 7);
      deadline.setHours(23, 59, 59, 0);
    }

    /* 남은 시간 계산 함수 */
    const calcRemaining = () => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);

      setTimeLeft({ days, hours, minutes });
    };

    /* 즉시 1회 실행 후 1초 간격 업데이트 */
    calcRemaining();
    const interval = setInterval(calcRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  /* 숫자를 2자리로 포맷 */
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="mt-3 inline-flex gap-3">
      {/* 일 */}
      <div
        className="min-w-[56px] rounded-[10px] px-3.5 py-2 text-center"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="text-[22px] text-[#F5C36A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {pad(timeLeft.days)}
        </div>
        <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
          일
        </div>
      </div>

      {/* 시간 */}
      <div
        className="min-w-[56px] rounded-[10px] px-3.5 py-2 text-center"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="text-[22px] text-[#F5C36A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {pad(timeLeft.hours)}
        </div>
        <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
          시간
        </div>
      </div>

      {/* 분 */}
      <div
        className="min-w-[56px] rounded-[10px] px-3.5 py-2 text-center"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="text-[22px] text-[#F5C36A]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {pad(timeLeft.minutes)}
        </div>
        <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
          분
        </div>
      </div>
    </div>
  );
}
