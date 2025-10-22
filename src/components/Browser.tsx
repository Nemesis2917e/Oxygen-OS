import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Browser = () => {
  const [url, setUrl] = useState('https://www.example.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.example.com');
  const [history, setHistory] = useState<string[]>(['https://www.example.com']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleNavigate = () => {
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url;
    }
    setCurrentUrl(finalUrl);
    const newHistory = [...history.slice(0, historyIndex + 1), finalUrl];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setUrl(history[newIndex]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
      setUrl(history[newIndex]);
    }
  };

  const handleRefresh = () => {
    setCurrentUrl(currentUrl + '?t=' + Date.now());
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Navigation Bar */}
      <div className="h-14 border-b border-border flex items-center px-2 md:px-4 gap-1 md:gap-2 bg-card">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleBack}
          disabled={historyIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleForward}
          disabled={historyIndex === history.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRefresh}>
          <RotateCw className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 flex items-center gap-1 md:gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
              className="pl-8 md:pl-10 text-xs md:text-sm"
              placeholder="Enter URL..."
            />
          </div>
          <Button onClick={handleNavigate} variant="secondary" size="sm" className="hidden md:flex">
            Go
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-muted/50 border-b border-border px-4 py-2">
        <p className="text-xs text-muted-foreground">
          ⚠️ Note: Many websites (like Google) block iframe embedding for security. Try: example.com, wikipedia.org, or archive.org
        </p>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative bg-white">
        <iframe
          src={currentUrl}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          title="Browser Content"
        />
      </div>
    </div>
  );
};
