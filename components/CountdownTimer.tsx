"use client";

import { useEffect, useState, useRef, useCallback } from "react";

/**
 * 슬롯 한 자릿수 컴포넌트 — 초기 로딩 시 빠르게 회전 후 정지
 * @param digit 최종 표시할 숫자
 * @param stopDelay 도미노 정지까지의 딜레이 (ms) — 왼쪽부터 순차 정지
 */
function SlotDigit({ digit, stopDelay }: { digit: string; stopDelay: number }) {
  /* 현재 화면에 보이는 숫자 */
  const [display, setDisplay] = useState("0");
  /* 슬롯 회전 중 여부 */
  const [spinning, setSpinning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    /* 슬롯 회전: 40ms마다 랜덤 숫자로 교체 (두루루룩 효과) */
    intervalRef.current = setInterval(() => {
      setDisplay(String(Math.floor(Math.random() * 10)));
    }, 40);

    /* stopDelay 후 회전 정지 → 최종 숫자 표시 */
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplay(digit);
      setSpinning(false);
    }, stopDelay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* 초기 로딩 완료 후, 실시간 숫자 변경 시 슬롯 전환 */
  useEffect(() => {
    if (!spinning && display !== digit) {
      setDisplay(digit);
    }
  }, [digit, spinning, display]);

  return (
    <span
      className="relative inline-block overflow-hidden text-center"
      style={{ width: "0.62em", height: "1.15em" }}
    >
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{
          /* 정지 순간 아래에서 올라오는 바운스 효과 */
          transition: spinning ? "none" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transform: spinning ? "translateY(0)" : "translateY(0)",
        }}
      >
        {display}
      </span>
    </span>
  );
}

/**
 * 슬롯 숫자 그룹 — 2자리 숫자의 각 자릿수를 도미노 딜레이로 정지
 * @param value 2자리 문자열 (예: "07")
 * @param baseDelay 이 그룹의 시작 딜레이 (ms)
 */
function SlotNumber({ value, baseDelay }: { value: string; baseDelay: number }) {
  return (
    <span className="inline-flex justify-center" style={{ fontFamily: "var(--font-accent)" }}>
      {value.split("").map((d, i) => (
        <SlotDigit
          key={i}
          digit={d}
          /* 각 자릿수마다 150ms씩 추가 딜레이 → 도미노 정지 효과 */
          stopDelay={baseDelay + i * 150}
        />
      ))}
    </span>
  );
}

/**
 * 카운트다운 타이머 — 빠칭코 슬롯머신 스타일
 * - 초기 로딩: 모든 숫자가 두루루룩 회전 → 왼쪽(일)부터 도미노로 정지
 * - 이후: 실시간 카운트다운 (초 단위)
 */
export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const calcRemaining = useCallback((deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();

    if (diff <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    setTimeLeft({
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    });
  }, []);

  useEffect(() => {
    const envDeadline = process.env.NEXT_PUBLIC_DEADLINE;
    const deadline = envDeadline
      ? new Date(envDeadline)
      : (() => { const d = new Date(); d.setDate(d.getDate() + 7); d.setHours(23, 59, 59, 0); return d; })();

    calcRemaining(deadline);
    const interval = setInterval(() => calcRemaining(deadline), 1000);
    return () => clearInterval(interval);
  }, [calcRemaining]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const boxClass = "min-w-[52px] rounded-[10px] border border-white/[0.1] px-3 py-2 text-center backdrop-blur-sm";
  const boxBg = { background: "rgba(255,255,255,0.1)" };

  return (
    <div className="mt-3 inline-flex items-center gap-2">
      {/* 일 — 가장 먼저 정지 (800ms) */}
      <div className={boxClass} style={boxBg}>
        <div className="text-[20px] text-[#F5C36A]">
          <SlotNumber value={pad(timeLeft.days)} baseDelay={800} />
        </div>
        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>일</div>
      </div>

      <span className="text-[16px] font-bold text-white/30">:</span>

      {/* 시간 — 두 번째 정지 (1200ms) */}
      <div className={boxClass} style={boxBg}>
        <div className="text-[20px] text-[#F5C36A]">
          <SlotNumber value={pad(timeLeft.hours)} baseDelay={1200} />
        </div>
        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>시간</div>
      </div>

      <span className="text-[16px] font-bold text-white/30">:</span>

      {/* 분 — 세 번째 정지 (1600ms) */}
      <div className={boxClass} style={boxBg}>
        <div className="text-[20px] text-[#F5C36A]">
          <SlotNumber value={pad(timeLeft.minutes)} baseDelay={1600} />
        </div>
        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>분</div>
      </div>

      <span className="text-[16px] font-bold text-white/30">:</span>

      {/* 초 — 마지막 정지 (2000ms) */}
      <div className={boxClass} style={boxBg}>
        <div className="text-[20px] text-[#F5C36A]">
          <SlotNumber value={pad(timeLeft.seconds)} baseDelay={2000} />
        </div>
        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>초</div>
      </div>
    </div>
  );
}
