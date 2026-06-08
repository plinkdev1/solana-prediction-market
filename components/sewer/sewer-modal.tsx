'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { HTMLAttributes } from 'react';

interface SewerModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
}

export function SewerModal({
  isOpen,
  onClose,
  title,
  showCloseButton = true,
  children,
  className,
  ...props
}: SewerModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-[#12001a]/80 backdrop-blur-sm" />
      
      {/* Modal content */}
      <div
        className={cn(
          'relative z-10 bg-[#0a0012] border-2 border-[#ff00aa] rounded-lg shadow-[0_0_30px_rgba(255,0,170,0.8)]',
          'max-w-lg w-full max-h-[90vh] overflow-y-auto',
          'animate-in fade-in zoom-in duration-300',
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-[#ff00aa]/30">
            {title && (
              <h2 className="text-2xl font-[family-name:var(--font-display)] text-[#ff00aa] uppercase">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto text-[#a0a0ff] hover:text-[#ff00aa] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
