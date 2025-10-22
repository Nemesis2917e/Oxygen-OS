import { useState, useRef, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface WindowProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  zIndex: number;
  onFocus: () => void;
}

export const Window = ({
  id,
  title,
  icon,
  children,
  onClose,
  onMinimize,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 800, height: 600 },
  zIndex,
  onFocus,
}: WindowProps) => {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);
  const savedState = useRef<{ position: typeof position; size: typeof size } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    e.stopPropagation();
    onFocus();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragRef.current) {
        const deltaX = e.clientX - dragRef.current.startX;
        const deltaY = e.clientY - dragRef.current.startY;
        setPosition({
          x: dragRef.current.startPosX + deltaX,
          y: dragRef.current.startPosY + deltaY,
        });
      }
      if (isResizing && resizeRef.current) {
        const deltaX = e.clientX - resizeRef.current.startX;
        const deltaY = e.clientY - resizeRef.current.startY;
        setSize({
          width: Math.max(400, resizeRef.current.startWidth + deltaX),
          height: Math.max(300, resizeRef.current.startHeight + deltaY),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  const toggleMaximize = () => {
    if (!isMaximized) {
      savedState.current = { position, size };
      setIsMaximized(true);
    } else {
      if (savedState.current) {
        setPosition(savedState.current.position);
        setSize(savedState.current.size);
      }
      setIsMaximized(false);
    }
  };

  return (
    <div
      className="absolute bg-card window-shadow rounded-xl overflow-hidden flex flex-col max-w-full max-h-full"
      style={{
        left: isMaximized ? 0 : Math.min(position.x, window.innerWidth - 100),
        top: isMaximized ? 0 : Math.min(position.y, window.innerHeight - 100),
        width: isMaximized ? '100vw' : Math.min(size.width, window.innerWidth),
        height: isMaximized ? 'calc(100vh - 48px)' : Math.min(size.height, window.innerHeight - 60),
        zIndex,
      }}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div
        className="h-10 md:h-12 bg-card border-b border-border flex items-center justify-between px-2 md:px-4 draggable-handle"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1 md:gap-2 min-w-0 flex-1">
          <div className="flex-shrink-0">{icon}</div>
          <span className="font-medium text-xs md:text-sm truncate">{title}</span>
        </div>
        <div className="flex gap-0.5 md:gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 md:h-8 md:w-8 hover:bg-muted"
            onClick={onMinimize}
          >
            <Minus className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 md:h-8 md:w-8 hover:bg-muted"
            onClick={toggleMaximize}
          >
            <Square className="h-2.5 w-2.5 md:h-3 md:w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 md:h-8 md:w-8 hover:bg-destructive hover:text-destructive-foreground"
            onClick={onClose}
          >
            <X className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-background">
        {children}
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};
