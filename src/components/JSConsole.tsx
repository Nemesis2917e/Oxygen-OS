import { useState, useRef, useEffect } from 'react';
import { Play, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface LogEntry {
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: number;
}

export const JSConsole = () => {
  const [code, setCode] = useState('// Write JavaScript code here\nconsole.log("Hello, Windows 11!");');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (type: LogEntry['type'], content: string) => {
    setLogs((prev) => [...prev, { type, content, timestamp: Date.now() }]);
  };

  const executeCode = () => {
    addLog('input', code);
    
    // Create a sandboxed console
    const consoleOutput: string[] = [];
    const sandboxedConsole = {
      log: (...args: any[]) => {
        consoleOutput.push(args.map(String).join(' '));
      },
      error: (...args: any[]) => {
        consoleOutput.push('ERROR: ' + args.map(String).join(' '));
      },
      warn: (...args: any[]) => {
        consoleOutput.push('WARN: ' + args.map(String).join(' '));
      },
    };

    try {
      // Create a function with the code
      const fn = new Function('console', code);
      const result = fn(sandboxedConsole);
      
      if (consoleOutput.length > 0) {
        addLog('output', consoleOutput.join('\n'));
      }
      
      if (result !== undefined) {
        addLog('output', `→ ${String(result)}`);
      }
    } catch (error) {
      addLog('error', String(error));
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="h-14 border-b border-border flex items-center px-4 gap-2 bg-card">
        <Button onClick={executeCode} variant="default">
          <Play className="h-4 w-4 mr-2" />
          Run Code
        </Button>
        <Button onClick={clearLogs} variant="secondary">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Console
        </Button>
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-1/2 border-b border-border p-4">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full font-mono text-sm resize-none"
            placeholder="Enter JavaScript code..."
          />
        </div>

        {/* Console Output */}
        <div className="h-1/2 overflow-auto p-4 bg-muted/30">
          <div className="font-mono text-sm space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  log.type === 'input'
                    ? 'bg-primary/10 text-primary'
                    : log.type === 'error'
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-card'
                }`}
              >
                <pre className="whitespace-pre-wrap break-words">{log.content}</pre>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
