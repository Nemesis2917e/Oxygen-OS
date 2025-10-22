import { LucideIcon } from 'lucide-react';

interface DesktopIconProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export const DesktopIcon = ({ icon: Icon, label, onClick }: DesktopIconProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-lg hover:bg-white/20 active:bg-white/30 transition-all duration-200 group"
    >
      <Icon className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" />
      <span className="text-white text-xs md:text-sm mt-1 text-center drop-shadow-lg">
        {label}
      </span>
    </button>
  );
};
