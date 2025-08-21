'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import gsap from 'gsap';

type AnimatedSingleElementProps = {
  children: ReactNode;
  className?: string;
  animation?:
    | 'fadeUp'
    | 'fadeIn'
    | 'scaleIn'
    | 'fromRight'
    | 'fromLeft'
    | ((target: HTMLElement) => void);
  duration?: number;
  ease?: string;
  delay?: number;
  auto?: boolean;
  threshold?: number;
  endClassName?: string;
};

export default function AnimatedSingleElement({
  children,
  className,
  animation = 'fadeUp',
  duration = 0.8,
  ease = 'back.out(1.7)',
  delay = 0,
  auto = false,
  threshold = 0.3,
  endClassName = '',
}: AnimatedSingleElementProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const hasAnimated = useRef(false);

  // Function to set initial state
  const setInitialState = (target: HTMLElement) => {
    if (typeof animation === 'function') {
      // For custom animations, we can't predict the initial state
      // So we'll set a basic invisible state
      gsap.set(target, { opacity: 0 });
      return;
    }

    let initialState: gsap.TweenVars = {};
    switch (animation) {
      case 'fadeUp':
        initialState = { y: 50, opacity: 0 };
        break;
      case 'fadeIn':
        initialState = { opacity: 0 };
        break;
      case 'scaleIn':
        initialState = { scale: 0.5, opacity: 0 };
        break;
      case 'fromRight':
        initialState = { x: 80, opacity: 0, rotation: 15 };
        break;
      case 'fromLeft':
        initialState = { x: -80, opacity: 0, rotation: -15 };
        break;
    }

    gsap.set(target, initialState);
  };

  // Function to animate to final state
  const runAnimation = () => {
    if (!elRef.current || hasAnimated.current) return;
    const target = elRef.current;

    hasAnimated.current = true;

    if (typeof animation === 'function') {
      animation(target);
      if (endClassName) target.classList.add(endClassName);
      return;
    }

    let finalState: gsap.TweenVars = {};
    switch (animation) {
      case 'fadeUp':
        finalState = { y: 0, opacity: 1 };
        break;
      case 'fadeIn':
        finalState = { opacity: 1 };
        break;
      case 'scaleIn':
        finalState = { scale: 1, opacity: 1 };
        break;
      case 'fromRight':
        finalState = { x: 0, opacity: 1, rotation: 0 };
        break;
      case 'fromLeft':
        finalState = { x: 0, opacity: 1, rotation: 0 };
        break;
    }

    gsap.to(target, {
      ...finalState,
      duration,
      ease,
      delay,
      onComplete: () => {
        if (endClassName) target.classList.add(endClassName);
      },
    });
  };

  // Set initial state immediately when component mounts
  useEffect(() => {
    if (!elRef.current) return;
    setInitialState(elRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation]);

  // Handle animation triggering
  useEffect(() => {
    if (!elRef.current) return;

    if (auto) {
      // Small delay to ensure initial state is set
      const timer = setTimeout(() => {
        runAnimation();
      }, 50);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runAnimation();
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold },
    );

    observer.observe(elRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation, duration, ease, delay, auto, threshold, endClassName]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
}
