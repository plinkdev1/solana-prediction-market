'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  resolutionDate: string;
  resolutionWindowHours?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function CountdownTimer({
  resolutionDate,
  resolutionWindowHours,
  size = 'md',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const updateCountdown = () => {
      const now = new Date();
      const resolution = new Date(resolutionDate);
      const diff = resolution.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('RESOLVED');
        setIsUrgent(false);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Mark as urgent if less than 1 hour remaining
      setIsUrgent(diff < 1000 * 60 * 60);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    // Initial update
    updateCountdown();

    // Update every second for < 1 hour, every 30s otherwise
    const interval = isUrgent ? setInterval(updateCountdown, 1000) : setInterval(updateCountdown, 30000);

    return () => clearInterval(interval);
  }, [resolutionDate, isUrgent]);

  if (!isMounted || !timeLeft) {
    return (
      <span className={`font-mono ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg'}`}>
        --:--
      </span>
    );
  }

  const textSizeClass =
    size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';
  const pulseClass = isUrgent && timeLeft !== 'RESOLVED' ? 'animate-pulse' : '';

  return (
    <span
      className={`font-mono font-bold ${textSizeClass} ${
        timeLeft === 'RESOLVED'
          ? 'text-[#a0a0ff]'
          : isUrgent
            ? 'text-[#ff0000] ${pulseClass} drop-shadow-lg drop-shadow-red'
            : 'text-[#00ffcc]'
      }`}
    >
      {timeLeft}
    </span>
  );
}
