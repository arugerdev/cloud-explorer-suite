import { FileSystemItem } from "@/data/mockFileSystem";
import { apiService } from "@/services/api";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { FileIcon } from "./FileIcon";

interface SidebarProps { currentPath: string; onNavigate: (path: string) => void; }

interface TreeItemProps { item: FileSystemItem; currentPath: string; onNavigate: (path: string) => void; level: number; }

function TreeItem({ item, currentPath, onNavigate, level }: TreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [children, setChildren] = useState<FileSystemItem[] | null>(null);
  const isActive = currentPath === item.path;

  const handleToggle = async () => {
    if (item.type === "folder") {
      // onNavigate(item.path);

      if (!isExpanded) {
        try {
          const fetchedChildren = await apiService.getUserFiles(item.path);
          setChildren(fetchedChildren);
        } catch (err) {
          console.error("Error cargando hijos:", err);
        }
      }

      setIsExpanded(!isExpanded);
    }
  };

  const handleNavigate = (e: React.MouseEvent) => {
    // Solo navegar con doble clic
    if (item.type === "folder") {
      if (e.detail === 2) {
        onNavigate(item.path);
      }
    }
  };

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 rounded-md cursor-pointer transition-colors ${isActive ? "bg-selected text-primary font-medium" : "hover:bg-secondary"
          }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={handleToggle}
        onDoubleClick={handleNavigate}
      >
        {item.type === "folder" ? (
          isExpanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />
        ) : (
          <div className="w-4 mr-1" />
        )}

        <FileIcon type={item.type} extension={item.extension} className="h-4 w-4 mr-2" />
        <span className="truncate text-sm">{item.name}</span>
      </div>

      {isExpanded && children && children.length > 0 && (
        <div>
          {children.map((child) => (
            <TreeItem key={child.id} item={child} currentPath={currentPath} onNavigate={onNavigate} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ currentPath, onNavigate, reloadTrigger }: { currentPath: string; onNavigate: (path: string) => void; reloadTrigger: number }) {
  const [rootItems, setRootItems] = useState<FileSystemItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoot = async () => {
      setLoading(true);
      try {
        const items = await apiService.getUserFiles("/");
        setRootItems(items);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchRoot();
  }, [reloadTrigger]); // ✅ se recarga cuando cambia reloadTrigger

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Explorador</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div
          className={`flex items-center py-2 px-2 rounded-md cursor-pointer transition-colors ${currentPath === "/" ? "bg-selected text-primary font-medium" : "hover:bg-secondary"
            }`}
          onClick={() => onNavigate("/")}
        >
          <FileIcon type="folder" className="h-4 w-4 mr-2" />
          <span className="text-sm">Inicio</span>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground px-2">Cargando...</p>
        ) : (
          rootItems.map((item) => (
            <TreeItem key={item.id} item={item} currentPath={currentPath} onNavigate={onNavigate}
              level={0} />
          ))
        )}
      </div>
    </div>
  );
}

