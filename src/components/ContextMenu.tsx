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

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  items: FileSystemItem[];
  isEmptySpace: boolean;
}

interface MenuAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  destructive?: boolean;
  separator?: boolean;
}

export function ContextMenu({ x, y, onClose, items, isEmptySpace }: ContextMenuProps) {
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

  const emptySpaceActions: MenuAction[] = [
    {
      label: 'Nueva carpeta',
      icon: FolderPlus,
      action: () => {
        console.log('Crear nueva carpeta');
        onClose();
      },
    },
    {
      label: 'Nuevo archivo',
      icon: FilePlus,
      action: () => {
        console.log('Crear nuevo archivo');
        onClose();
      },
    },
    {
      label: 'Pegar',
      icon: Clipboard,
      action: () => {
        console.log('Pegar');
        onClose();
      },
      separator: true,
    },
  ];

  const fileActions: MenuAction[] = [
    {
      label: items.length === 1 ? 'Descargar' : `Descargar (${items.length})`,
      icon: Download,
      action: () => {
        console.log('Descargar archivos:', items);
        onClose();
      },
    },
    {
      label: 'Compartir',
      icon: Share,
      action: () => {
        console.log('Compartir archivos:', items);
        onClose();
      },
      separator: true,
    },
    {
      label: 'Copiar',
      icon: Copy,
      action: () => {
        console.log('Copiar archivos:', items);
        onClose();
      },
    },
    {
      label: 'Cortar',
      icon: Scissors,
      action: () => {
        console.log('Cortar archivos:', items);
        onClose();
      },
    },
    {
      label: items.length === 1 ? 'Renombrar' : 'Renombrar múltiples',
      icon: Edit3,
      action: () => {
        console.log('Renombrar archivos:', items);
        onClose();
      },
      separator: true,
    },
    {
      label: 'Comprimir',
      icon: Archive,
      action: () => {
        console.log('Comprimir archivos:', items);
        onClose();
      },
    },
    {
      label: 'Propiedades',
      icon: Info,
      action: () => {
        console.log('Ver propiedades:', items);
        onClose();
      },
      separator: true,
    },
    {
      label: items.length === 1 ? 'Eliminar' : `Eliminar (${items.length})`,
      icon: Trash2,
      action: () => {
        console.log('Eliminar archivos:', items);
        onClose();
      },
      destructive: true,
    },
  ];

  const actions = isEmptySpace ? emptySpaceActions : fileActions;

  // Adjust menu position to stay within viewport
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
            className={`context-menu-item w-full ${
              action.destructive ? 'text-destructive hover:text-destructive-foreground' : ''
            }`}
            onClick={action.action}
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