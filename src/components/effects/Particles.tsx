import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWorkflowStore } from '../../store/workflowStore';

export function Particles() {
  const reduceMotion = useWorkflowStore((s) => s.reduceMotion);
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        duration: 12 + Math.random() * 18,
        delay: Math.random() * 8,
      })),
    []
  );

  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(211,47,47,0.11),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(211,47,47,0.05),_transparent_40%)]" />
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-[#D32F2F]/40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            boxShadow: '0 0 8px rgba(211,47,47,0.35)',
          }}
          animate={{ y: [0, -40, 0], opacity: [0.15, 0.55, 0.15] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
