import { useState } from 'react';
import { Window } from '@/components/Window';
import { Taskbar, taskbarApps } from '@/components/Taskbar';
import { StartMenu } from '@/components/StartMenu';
import { Calculator } from '@/components/Calculator';
import { FileExplorer } from '@/components/FileExplorer';
import { Browser } from '@/components/Browser';
import { JSConsole } from '@/components/JSConsole';
import { Notepad } from '@/components/Notepad';
import { Paint } from '@/components/Paint';
import { Settings } from '@/components/Settings';
import { GitHub } from '@/components/GitHub';
import { DesktopIcon } from '@/components/DesktopIcon';
import { Calculator as CalcIcon, FolderOpen, Globe, Terminal, FileText, Palette, Settings as SettingsIcon, Github } from 'lucide-react';
import wallpaper from '@/assets/oxygen-wallpaper.jpg';

interface OpenWindow {
  id: string;
  appId: string;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  zIndex: number;
  isMinimized: boolean;
}

const Index = () => {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [nextZIndex, setNextZIndex] = useState(1000);
  const [showStartMenu, setShowStartMenu] = useState(false);

  const getAppComponent = (appId: string) => {
    switch (appId) {
      case 'calculator':
        return {
          title: 'Calculator',
          icon: <CalcIcon className="h-4 w-4" />,
          component: <Calculator />,
        };
      case 'explorer':
        return {
          title: 'File Explorer',
          icon: <FolderOpen className="h-4 w-4" />,
          component: <FileExplorer />,
        };
      case 'browser':
        return {
          title: 'Browser',
          icon: <Globe className="h-4 w-4" />,
          component: <Browser />,
        };
      case 'console':
        return {
          title: 'JavaScript Console',
          icon: <Terminal className="h-4 w-4" />,
          component: <JSConsole />,
        };
      case 'notepad':
        return {
          title: 'Notepad',
          icon: <FileText className="h-4 w-4" />,
          component: <Notepad />,
        };
      case 'paint':
        return {
          title: 'Paint',
          icon: <Palette className="h-4 w-4" />,
          component: <Paint />,
        };
      case 'settings':
        return {
          title: 'Settings',
          icon: <SettingsIcon className="h-4 w-4" />,
          component: <Settings />,
        };
      case 'github':
        return {
          title: 'GitHub',
          icon: <Github className="h-4 w-4" />,
          component: <GitHub />,
        };
      default:
        return null;
    }
  };

  const openApp = (appId: string) => {
    // Check if already open
    const existingWindow = openWindows.find((w) => w.appId === appId);
    if (existingWindow) {
      // Focus and unminimize if minimized
      if (existingWindow.isMinimized) {
        setOpenWindows((windows) =>
          windows.map((w) =>
            w.id === existingWindow.id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w
          )
        );
        setNextZIndex((z) => z + 1);
      } else {
        focusWindow(existingWindow.id);
      }
      setShowStartMenu(false);
      return;
    }

    const appInfo = getAppComponent(appId);
    if (!appInfo) return;

    const newWindow: OpenWindow = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: appInfo.title,
      icon: appInfo.icon,
      component: appInfo.component,
      zIndex: nextZIndex,
      isMinimized: false,
    };

    setOpenWindows((windows) => [...windows, newWindow]);
    setNextZIndex((z) => z + 1);
    setShowStartMenu(false);
  };

  const closeWindow = (id: string) => {
    setOpenWindows((windows) => windows.filter((w) => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setOpenWindows((windows) =>
      windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  const focusWindow = (id: string) => {
    setOpenWindows((windows) =>
      windows.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w))
    );
    setNextZIndex((z) => z + 1);
  };

  const toggleStartMenu = () => {
    setShowStartMenu(!showStartMenu);
  };

  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={() => showStartMenu && setShowStartMenu(false)}
    >
      {/* Desktop Area */}
      <div className="w-full h-full pb-12 md:pb-14">
        {/* Desktop Icons */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-auto gap-2 md:gap-4 p-4 md:p-6 pointer-events-auto">
          <DesktopIcon
            icon={FolderOpen}
            label="File Explorer"
            onClick={() => openApp('explorer')}
          />
          <DesktopIcon
            icon={Globe}
            label="Browser"
            onClick={() => openApp('browser')}
          />
          <DesktopIcon
            icon={CalcIcon}
            label="Calculator"
            onClick={() => openApp('calculator')}
          />
          <DesktopIcon
            icon={Terminal}
            label="JS Console"
            onClick={() => openApp('console')}
          />
          <DesktopIcon
            icon={FileText}
            label="Notepad"
            onClick={() => openApp('notepad')}
          />
          <DesktopIcon
            icon={Palette}
            label="Paint"
            onClick={() => openApp('paint')}
          />
          <DesktopIcon
            icon={SettingsIcon}
            label="Settings"
            onClick={() => openApp('settings')}
          />
          <DesktopIcon
            icon={Github}
            label="GitHub"
            onClick={() => openApp('github')}
          />
        </div>

        {/* Windows */}
        {openWindows
          .filter((w) => !w.isMinimized)
          .map((win) => (
            <Window
              key={win.id}
              id={win.id}
              title={win.title}
              icon={win.icon}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              zIndex={win.zIndex}
              onFocus={() => focusWindow(win.id)}
              defaultPosition={{
                x: Math.min(50 + openWindows.indexOf(win) * 20, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 300),
                y: Math.min(30 + openWindows.indexOf(win) * 20, (typeof window !== 'undefined' ? window.innerHeight : 800) - 300),
              }}
              defaultSize={
                win.appId === 'calculator'
                  ? { width: Math.min(400, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 40), height: Math.min(600, (typeof window !== 'undefined' ? window.innerHeight : 800) - 100) }
                  : win.appId === 'notepad' || win.appId === 'settings' || win.appId === 'github'
                  ? { width: Math.min(700, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 40), height: Math.min(500, (typeof window !== 'undefined' ? window.innerHeight : 800) - 100) }
                  : { width: Math.min(900, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 40), height: Math.min(650, (typeof window !== 'undefined' ? window.innerHeight : 800) - 100) }
              }
            >
              {win.component}
            </Window>
          ))}
      </div>

      {/* Start Menu */}
      {showStartMenu && (
        <div onClick={(e) => e.stopPropagation()}>
          <StartMenu onAppClick={openApp} />
        </div>
      )}

      {/* Taskbar */}
      <Taskbar
        apps={taskbarApps}
        onAppClick={openApp}
        onStartClick={toggleStartMenu}
        openWindows={openWindows.map((w) => w.appId)}
      />
    </div>
  );
};

export default Index;
