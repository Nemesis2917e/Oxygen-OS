import { useState, useEffect } from 'react';
import { Folder, File, Plus, Trash2, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}

const initialFileSystem: FileNode = {
  name: 'root',
  type: 'folder',
  children: [
    {
      name: 'Documents',
      type: 'folder',
      children: [
        { name: 'welcome.txt', type: 'file', content: 'Welcome to Oxygen OS!' },
      ],
    },
    {
      name: 'Downloads',
      type: 'folder',
      children: [],
    },
    {
      name: 'Desktop',
      type: 'folder',
      children: [],
    },
  ],
};

export const FileExplorer = () => {
  const [fileSystem, setFileSystem] = useState<FileNode>(initialFileSystem);
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('fileSystem');
    if (saved) {
      setFileSystem(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
  }, [fileSystem]);

  const getCurrentFolder = (): FileNode => {
    let current = fileSystem;
    for (let i = 1; i < currentPath.length; i++) {
      const folder = current.children?.find((c) => c.name === currentPath[i]);
      if (folder && folder.type === 'folder') {
        current = folder;
      }
    }
    return current;
  };

  const navigateToFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName]);
    setSelectedItem(null);
  };

  const navigateUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
    setSelectedItem(null);
  };

  const createNewItem = (type: 'file' | 'folder') => {
    if (!newItemName.trim()) {
      toast.error('Please enter a name');
      return;
    }

    const updateFileSystem = (node: FileNode, path: string[]): FileNode => {
      if (path.length === 0) {
        const newItem: FileNode = {
          name: newItemName,
          type,
          ...(type === 'folder' ? { children: [] } : { content: '' }),
        };
        return {
          ...node,
          children: [...(node.children || []), newItem],
        };
      }

      return {
        ...node,
        children: node.children?.map((child) =>
          child.name === path[0] ? updateFileSystem(child, path.slice(1)) : child
        ),
      };
    };

    setFileSystem(updateFileSystem(fileSystem, currentPath.slice(1)));
    setNewItemName('');
    toast.success(`${type === 'file' ? 'File' : 'Folder'} created successfully`);
  };

  const deleteItem = (itemName: string) => {
    const updateFileSystem = (node: FileNode, path: string[]): FileNode => {
      if (path.length === 0) {
        return {
          ...node,
          children: node.children?.filter((child) => child.name !== itemName),
        };
      }

      return {
        ...node,
        children: node.children?.map((child) =>
          child.name === path[0] ? updateFileSystem(child, path.slice(1)) : child
        ),
      };
    };

    setFileSystem(updateFileSystem(fileSystem, currentPath.slice(1)));
    setSelectedItem(null);
    toast.success('Item deleted');
  };

  const currentFolder = getCurrentFolder();

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Address Bar */}
      <div className="h-10 md:h-12 border-b border-border flex items-center px-2 md:px-4 gap-2 bg-card">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:h-10 md:w-10"
          onClick={navigateUp}
          disabled={currentPath.length === 1}
        >
          <Home className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
        <div className="flex items-center gap-1 text-xs md:text-sm flex-1 overflow-x-auto">
          {currentPath.map((segment, index) => (
            <div key={index} className="flex items-center gap-1 flex-shrink-0">
              {index > 0 && <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />}
              <span className="text-muted-foreground">{segment}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="h-auto md:h-14 border-b border-border flex flex-wrap items-center p-2 md:px-4 gap-2 bg-card">
        <Input
          placeholder="New item name..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="max-w-xs text-sm"
        />
        <Button variant="secondary" size="sm" onClick={() => createNewItem('folder')} className="text-xs md:text-sm">
          <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
          <span className="hidden sm:inline">Folder</span>
          <span className="sm:hidden">Dir</span>
        </Button>
        <Button variant="secondary" size="sm" onClick={() => createNewItem('file')} className="text-xs md:text-sm">
          <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" />
          File
        </Button>
        {selectedItem && (
          <Button variant="destructive" size="sm" onClick={() => deleteItem(selectedItem)} className="text-xs md:text-sm">
            <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            <span className="hidden sm:inline">Delete</span>
            <span className="sm:hidden">Del</span>
          </Button>
        )}
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto p-2 md:p-4">
        <div className="grid grid-cols-1 gap-1">
          {currentFolder.children?.map((item) => (
            <div
              key={item.name}
              className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg cursor-pointer transition-colors ${
                selectedItem === item.name ? 'bg-primary/20 border border-primary' : 'hover:bg-muted border border-transparent'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (item.type === 'folder') {
                  navigateToFolder(item.name);
                } else {
                  setSelectedItem(item.name);
                }
              }}
            >
              {item.type === 'folder' ? (
                <Folder className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
              ) : (
                <File className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
              )}
              <span className="text-xs md:text-sm truncate">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
