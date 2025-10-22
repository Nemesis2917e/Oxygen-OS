import { useState, useEffect } from 'react';
import { Monitor, Palette, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export const Settings = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  
  const [animations, setAnimations] = useState(() => {
    const saved = localStorage.getItem('animations');
    return saved ? JSON.parse(saved) : true;
  });
  
  const [transparency, setTransparency] = useState(() => {
    const saved = localStorage.getItem('transparency');
    return saved ? JSON.parse(saved) : true;
  });
  
  const [blur, setBlur] = useState(() => {
    const saved = localStorage.getItem('blur');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--animation-duration',
      animations ? '0.3s' : '0s'
    );
    localStorage.setItem('animations', JSON.stringify(animations));
  }, [animations]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--transparency-opacity',
      transparency ? '0.95' : '1'
    );
    localStorage.setItem('transparency', JSON.stringify(transparency));
  }, [transparency]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--blur-amount',
      blur ? '20px' : '0px'
    );
    localStorage.setItem('blur', JSON.stringify(blur));
  }, [blur]);

  const handleToggle = (setting: string, value: boolean) => {
    toast.success(`${setting} ${value ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="w-full h-full overflow-auto bg-background p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Settings</h1>
      
      <div className="space-y-4 md:space-y-6 max-w-2xl">
        {/* Display Settings */}
        <Card className="p-3 md:p-4">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <Monitor className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <h2 className="text-base md:text-lg font-semibold">Display</h2>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-sm md:text-base">Dark Mode</Label>
              <Switch 
                id="dark-mode" 
                checked={darkMode}
                onCheckedChange={(checked) => {
                  setDarkMode(checked);
                  handleToggle('Dark mode', checked);
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="animations" className="text-sm md:text-base">Enable Animations</Label>
              <Switch 
                id="animations" 
                checked={animations}
                onCheckedChange={(checked) => {
                  setAnimations(checked);
                  handleToggle('Animations', checked);
                }}
              />
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-3 md:p-4">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <Palette className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <h2 className="text-base md:text-lg font-semibold">Appearance</h2>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="transparency" className="text-sm md:text-base">Transparency Effects</Label>
              <Switch 
                id="transparency" 
                checked={transparency}
                onCheckedChange={(checked) => {
                  setTransparency(checked);
                  handleToggle('Transparency', checked);
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="blur" className="text-sm md:text-base">Blur Effects</Label>
              <Switch 
                id="blur" 
                checked={blur}
                onCheckedChange={(checked) => {
                  setBlur(checked);
                  handleToggle('Blur effects', checked);
                }}
              />
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-3 md:p-4">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <Info className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            <h2 className="text-base md:text-lg font-semibold">About</h2>
          </div>
          <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
            <p>Oxygen OS Web Edition</p>
            <p>Version 1.0.0</p>
            <p>Built with React, TypeScript, and Tailwind CSS</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
