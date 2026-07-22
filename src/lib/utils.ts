import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function complexityColor(c: string): string {
  switch (c) {
    case 'low':
      return '#22C55E';
    case 'medium':
      return '#F59E0B';
    case 'high':
      return '#F97316';
    case 'critical':
      return '#E53935';
    default:
      return '#6B7280';
  }
}

export const RELATION_COLORS: Record<string, string> = {
  uses: '#60A5FA',
  creates: '#22C55E',
  reads: '#A78BFA',
  updates: '#F59E0B',
  deletes: '#EF4444',
  depends_on: '#E53935',
  one_to_many: '#38BDF8',
  many_to_many: '#F472B6',
  one_to_one: '#34D399',
};
