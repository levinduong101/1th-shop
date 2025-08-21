'use client';

import { type ElementType, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';

type AnimatedTextProps = {
  children: string;
  className?: string;
  as?: ElementType;
  split?: 'chars' | 'words';
  animation?: 'fadeUp' | 'fadeIn' | 'scaleIn' | 'fromRight' | ((targets: Element[]) => void);
  stagger?: number;
  duration?: number;
  ease?: string;
  delay?: number;
  auto?: boolean;
  threshold?: number;
  endClassName?: string;
};

export default function AnimatedText({
  children,
  className,
  as: Tag = 'div',
  split = 'chars',
  animation = 'fadeUp',
  stagger = 0.08,
  duration = 0.8,
  ease = 'back.out(1.7)',
  delay = 0,
  auto = false,
  threshold = 0.3,
  endClassName = '',
}: AnimatedTextProps) {
  const elRef = useRef<HTMLElement | null>(null);

  // Memoize split text
  const splittedHTML = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    const parts = split === 'words' ? text.split(' ') : text.split('');
    return parts
      .map((p) => `<span class="inline-block">${p === ' ' ? '&nbsp;' : p}</span>`)
      .join(split === 'words' ? ' ' : '');
  }, [children, split]);

  const runAnimation = () => {
    if (!elRef.current) return;
    elRef.current.innerHTML = splittedHTML;
    const targets = elRef.current.querySelectorAll('span');

    if (typeof animation === 'function') {
      animation(Array.from(targets));
      return;
    }

    let animConfig: gsap.TweenVars = {};
    switch (animation) {
      case 'fadeUp':
        animConfig = { y: 50, opacity: 0 };
        break;
      case 'fadeIn':
        animConfig = { opacity: 0 };
        break;
      case 'scaleIn':
        animConfig = { scale: 0.5, opacity: 0 };
        break;
      case 'fromRight':
        animConfig = { x: 80, opacity: 0, rotation: 25 };
        break;
    }

    gsap.from(targets, {
      ...animConfig,
      stagger,
      duration,
      ease,
      delay,
      onComplete: () => {
        if (elRef.current) {
          elRef.current.innerHTML = children as string;
          if (endClassName) {
            elRef.current.classList.add(endClassName);
          }
        }
      },
    });
  };

  useEffect(() => {
    if (!elRef.current) return;

    if (auto) {
      runAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runAnimation();
            observer.unobserve(elRef.current as Element);
          }
        });
      },
      { threshold },
    );

    observer.observe(elRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    splittedHTML,
    animation,
    stagger,
    duration,
    ease,
    delay,
    auto,
    threshold,
    children,
    endClassName,
  ]);

  return (
    <Tag ref={elRef} className={className}>
      {children}
    </Tag>
  );
}
