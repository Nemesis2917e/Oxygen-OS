import { Calculator, FolderOpen, Globe, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StartMenuProps {
  onAppClick: (appId: string) => void;
}

const apps = [
  { id: 'calculator', name: 'Calculator', icon: Calculator, description: 'Perform calculations' },
  { id: 'explorer', name: 'File Explorer', icon: FolderOpen, description: 'Browse files and folders' },
  { id: 'browser', name: 'Browser', icon: Globe, description: 'Browse the web' },
  { id: 'console', name: 'JS Console', icon: Terminal, description: 'Run JavaScript code' },
];

export const StartMenu = ({ onAppClick }: StartMenuProps) => {
  return (
    <div className="fixed bottom-14 md:bottom-16 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[600px] glass-effect window-shadow rounded-2xl p-4 md:p-6 border border-border/30 z-[9999]">
      <div className="mb-3 md:mb-4">
        <h2 className="text-base md:text-lg font-semibold mb-1">Pinned Apps</h2>
        <p className="text-xs md:text-sm text-muted-foreground">Your most used applications</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
        {apps.map((app) => (
          <Button
            key={app.id}
            variant="ghost"
            className="h-auto p-3 md:p-4 justify-start hover:bg-accent active:bg-accent/80 transition-all duration-200"
            onClick={() => onAppClick(app.id)}
          >
            <div className="flex items-center gap-2 md:gap-3 w-full">
              <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <app.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-medium text-sm md:text-base">{app.name}</div>
                <div className="text-xs text-muted-foreground truncate">{app.description}</div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
