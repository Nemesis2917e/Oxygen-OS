import { useState } from 'react';
import { Calculator as CalcIcon, FolderOpen, Globe, Terminal, Menu, FileText, Palette, Settings as SettingsIcon, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TaskbarApp {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface TaskbarProps {
  apps: TaskbarApp[];
  onAppClick: (appId: string) => void;
  onStartClick: () => void;
  openWindows: string[];
}

export const Taskbar = ({ apps, onAppClick, onStartClick, openWindows }: TaskbarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useState(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 md:h-14 glass-effect border-t border-border/30 flex items-center justify-center px-2 z-[9999]">
      <div className="flex items-center gap-0.5 md:gap-1">
        {/* Start Button */}
        <Button
          variant="ghost"
          size="icon"
          className="taskbar-item h-8 w-8 md:h-10 md:w-10 hover:bg-primary/20 active:bg-primary/30 transition-all duration-200"
          onClick={onStartClick}
        >
          <Menu className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        </Button>

        {/* App Icons */}
        {apps.map((app) => (
          <Button
            key={app.id}
            variant="ghost"
            size="icon"
            className={`taskbar-item h-8 w-8 md:h-10 md:w-10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 ${openWindows.includes(app.id) ? 'bg-primary/10' : ''}`}
            onClick={() => onAppClick(app.id)}
            title={app.name}
          >
            <div className="[&>svg]:h-4 [&>svg]:w-4 md:[&>svg]:h-5 md:[&>svg]:w-5">{app.icon}</div>
          </Button>
        ))}
      </div>

      {/* System Tray */}
      <div className="absolute right-2 md:right-4 flex items-center gap-2 md:gap-3">
        <div className="text-[10px] md:text-xs text-right">
          <div className="font-medium">{formatTime(currentTime)}</div>
          <div className="text-muted-foreground hidden sm:block">{formatDate(currentTime)}</div>
        </div>
      </div>
    </div>
  );
};

export const taskbarApps: TaskbarApp[] = [
  { id: 'calculator', name: 'Calculator', icon: <CalcIcon className="h-5 w-5" /> },
  { id: 'explorer', name: 'File Explorer', icon: <FolderOpen className="h-5 w-5" /> },
  { id: 'browser', name: 'Browser', icon: <Globe className="h-5 w-5" /> },
  { id: 'console', name: 'JS Console', icon: <Terminal className="h-5 w-5" /> },
  { id: 'notepad', name: 'Notepad', icon: <FileText className="h-5 w-5" /> },
  { id: 'paint', name: 'Paint', icon: <Palette className="h-5 w-5" /> },
  { id: 'settings', name: 'Settings', icon: <SettingsIcon className="h-5 w-5" /> },
  { id: 'github', name: 'GitHub', icon: <Github className="h-5 w-5" /> },
];
