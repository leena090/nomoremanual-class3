"use client";

import { useState, useEffect } from "react";

// 잔여석 카운터 컴포넌트 — API에서 현재 등록 인원 조회 후 남은 좌석 표시
export default function SeatCounter() {
  // 잔여석 상태: null이면 로딩 중, -1이면 에러
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 마운트 시 등록 인원 수 API 호출
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/enrollment/count");
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        // 전체 30석에서 등록된 인원 수를 빼서 잔여석 계산
        setRemaining(30 - (data.count ?? 0));
      } catch {
        // API 호출 실패 시 에러 상태로 전환
        setError(true);
      }
    };

    fetchCount();
  }, []);

  // 에러 시 "문의" 표시
  if (error) {
    return (
      <p className="text-sm text-[#6B6B6B] mt-3">
        잔여석: 문의
      </p>
    );
  }

  // 로딩 중일 때
  if (remaining === null) {
    return (
      <p className="text-sm text-[#6B6B6B] mt-3">
        잔여석 확인 중...
      </p>
    );
  }

  // 정상 표시: 잔여석 / 전체 30석
  return (
    <p className="text-sm text-[#6B6B6B] mt-3">
      잔여석: <span className="font-bold text-[#D4542B]">{remaining}</span> / 30
    </p>
  );
}
