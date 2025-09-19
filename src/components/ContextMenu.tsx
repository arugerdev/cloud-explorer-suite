// ContextMenu.tsx
import { useEffect, useRef } from "react";
import {
  Download,
  Copy,
  Scissors,
  Trash2,
  Edit3,
  Archive,
  FolderPlus,
  FilePlus,
  Clipboard,
  Share,
  Info,
} from "lucide-react";
import { FileSystemItem } from "../data/mockFileSystem";
import { apiService } from "@/services/api";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  items: FileSystemItem[];
  isEmptySpace: boolean;
  startCreateItem: (type: "folder" | "file") => void;
  reloadFiles: () => void;
  reloadSidebar: () => void;
}

interface MenuAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  destructive?: boolean;
  separator?: boolean;
}

export function ContextMenu({ x, y, onClose, items, isEmptySpace, startCreateItem, reloadFiles, reloadSidebar }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleDownload = async (files: FileSystemItem[]) => {
    try {
      for (const f of files) {
        const blob = await apiService.downloadFile(f.path);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = f.name;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Error descargando archivos:", err);
    }
    onClose();
  };

  const emptySpaceActions: MenuAction[] = [
    {
      label: "Nueva carpeta",
      icon: FolderPlus,
      action: () => {
        onClose();
        startCreateItem("folder");
      },
    },
    {
      label: "Nuevo archivo",
      icon: FilePlus,
      action: () => {
        onClose();
        startCreateItem("file");
      },
    },
    {
      label: 'Pegar',
      icon: Clipboard,
      action: undefined,
      separator: true,
    },
  ];

  const fileActions: MenuAction[] = [
    {
      label: items.length === 1 ? 'Descargar' : `Descargar (${items.length})`,
      icon: Download,
      action: () => handleDownload(items),
    },
    {
      label: 'Compartir',
      icon: Share,
      action: undefined,
      separator: true,
    },
    {
      label: 'Copiar',
      icon: Copy,
      action: undefined,
    },
    {
      label: 'Cortar',
      icon: Scissors,
      action: undefined,
    },
    {
      label: items.length === 1 ? 'Renombrar' : 'Renombrar múltiples',
      icon: Edit3,
      action: undefined,
      separator: true,
    },
    {
      label: 'Comprimir',
      icon: Archive,
      action: undefined,
    },
    {
      label: 'Propiedades',
      icon: Info,
      action: undefined,
      separator: true,
    },
    {
      label: items.length === 1 ? 'Eliminar' : `Eliminar (${items.length})`,
      icon: Trash2,
      action: () => {
        apiService.deleteFiles(items.map(i => i.path)).then(() => {
          reloadFiles();
          reloadSidebar();
        }).catch(err => {
          console.error("Error eliminando archivos:", err);
        });
        onClose();
      },
      destructive: true,
    },
  ];

  const actions = isEmptySpace ? emptySpaceActions : fileActions;

  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - actions.length * 40);

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{
        left: adjustedX,
        top: adjustedY,
      }}
    >
      {actions.map((action, index) => (
        <div key={index}>
          <button
            className={`context-menu-item w-full ${action.destructive ? 'text-destructive hover:text-destructive-foreground' : ''
              } ${action.action === undefined ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={action.action}
            disabled={action.action === undefined}
          >
            <action.icon className="mr-2 h-4 w-4" />
            {action.label}
          </button>
          {action.separator && <div className="my-1 h-px bg-border" />}
        </div>
      ))}
    </div>
  );
}