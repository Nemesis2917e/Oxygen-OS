import { useState } from 'react';
import { Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export const Notepad = () => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('untitled.txt');

  const handleSave = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File saved!');
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="h-12 border-b border-border flex items-center px-4 gap-2 bg-card">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="bg-transparent border-none outline-none text-sm flex-1"
        />
        <Button variant="secondary" size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>

      {/* Text Area */}
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing..."
        className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-sm p-4"
      />

      {/* Status Bar */}
      <div className="h-8 border-t border-border flex items-center px-4 bg-card">
        <span className="text-xs text-muted-foreground">
          {content.length} characters | {content.split('\n').length} lines
        </span>
      </div>
    </div>
  );
};
