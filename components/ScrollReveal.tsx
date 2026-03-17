"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CSSProperties, ReactNode } from "react";

/**
 * ScrollReveal — 스크롤 시 뷰포트 진입 애니메이션 래퍼
 * - fadeInUp / fadeInLeft / fadeInRight 방향 지원
 * - 스프링 물리 기반 자연스러운 모션 (stiffness: 100, damping: 20)
 * - prefers-reduced-motion 미디어 쿼리 존중
 */
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** 애니메이션 시작 지연 시간(초) */
  delay?: number;
  /** 진입 방향 — 기본값: 'up' */
  direction?: "up" | "left" | "right";
}

/* 방향별 초기 오프셋 값 매핑 */
const directionOffset = {
  up: { x: 0, y: 30 },
  left: { x: -30, y: 0 },
  right: { x: 30, y: 0 },
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  /* 사용자가 모션 줄이기를 선호하면 애니메이션 비활성화 */
  const prefersReducedMotion = useReducedMotion();

  const offset = directionOffset[direction];

  return (
    <motion.div
      className={className}
      /* 초기 상태: 투명 + 오프셋 위치 */
      initial={prefersReducedMotion ? false : { opacity: 0, x: offset.x, y: offset.y }}
      /* 뷰포트 진입 시 목표 상태 */
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      /* 한 번만 실행, 50px 마진으로 약간 일찍 트리거 */
      viewport={{ once: true, margin: "-50px" }}
      /* 스프링 물리 애니메이션 */
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerReveal — 자식 요소들을 순차적으로 등장시키는 부모 래퍼
 * - stagger 값만큼 간격을 두고 자식 애니메이션 실행
 */
interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  /** 인라인 스타일 (글래스 효과 등에 사용) */
  style?: CSSProperties;
  /** 자식 간 등장 간격(초) — 기본값: 0.1 */
  stagger?: number;
  /** 애니메이션 시작 지연 시간(초) */
  delay?: number;
}

export function StaggerReveal({
  children,
  className,
  style,
  stagger = 0.1,
  delay = 0,
}: StaggerRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      /* 부모는 투명에서 보이도록 전환 */
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      /* staggerChildren으로 자식 순차 등장 */
      transition={{
        staggerChildren: stagger,
        delayChildren: delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem — StaggerReveal의 자식으로 사용하는 개별 아이템
 * - 부모의 stagger 타이밍에 맞춰 fadeInUp 애니메이션
 */
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        /* 숨겨진 상태: 투명 + 아래로 20px 오프셋 */
        hidden: { opacity: 0, y: 20 },
        /* 보이는 상태: 완전 불투명 + 원래 위치 */
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
