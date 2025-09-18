import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FileSystemItem, buildFileTree } from "../data/mockFileSystem";
import { FileIcon } from "./FileIcon";

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface TreeItemProps {
  item: FileSystemItem;
  currentPath: string;
  onNavigate: (path: string) => void;
  level: number;
}

function TreeItem({ item, currentPath, onNavigate, level }: TreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(
    currentPath.startsWith(item.path) && item.path !== '/'
  );
  
  const hasChildren = item.children && item.children.length > 0;
  const isActive = currentPath === item.path;
  
  const handleToggle = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    if (item.type === 'folder') {
      onNavigate(item.path);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 rounded-md cursor-pointer transition-colors ${
          isActive 
            ? 'bg-selected text-primary font-medium' 
            : 'hover:bg-secondary'
        }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={handleToggle}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 mr-1 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
          )
        ) : (
          <div className="w-4 mr-1" />
        )}
        
        <FileIcon 
          type={item.type} 
          extension={item.extension} 
          className="h-4 w-4 mr-2 flex-shrink-0" 
        />
        
        <span className="truncate text-sm">{item.name}</span>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {item.children!.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              currentPath={currentPath}
              onNavigate={onNavigate}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const fileTree = buildFileTree();

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Explorador</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div
          className={`flex items-center py-2 px-2 rounded-md cursor-pointer transition-colors ${
            currentPath === '/' 
              ? 'bg-selected text-primary font-medium' 
              : 'hover:bg-secondary'
          }`}
          onClick={() => onNavigate('/')}
        >
          <FileIcon type="folder" className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm">Inicio</span>
        </div>
        
        {fileTree.map((item) => (
          <TreeItem
            key={item.id}
            item={item}
            currentPath={currentPath}
            onNavigate={onNavigate}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}