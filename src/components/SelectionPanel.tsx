import { Download, Trash2, Copy, Scissors, Archive, Share, X } from "lucide-react";
import { FileSystemItem, formatFileSize } from "../data/mockFileSystem";
import { Button } from "./ui/button";

interface SelectionPanelProps {
  selectedItems: FileSystemItem[];
  onClearSelection: () => void;
}

export function SelectionPanel({ selectedItems, onClearSelection }: SelectionPanelProps) {
  if (selectedItems.length === 0) return null;

  const totalSize = selectedItems.reduce((sum, item) => sum + (item.size || 0), 0);
  const folderCount = selectedItems.filter(item => item.type === 'folder').length;
  const fileCount = selectedItems.filter(item => item.type === 'file').length;

  const handleAction = (action: string) => {
    console.log(`Acción: ${action}`, selectedItems);
  };

  return (
    <div className="bg-card border-t border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">
              {selectedItems.length} elemento{selectedItems.length !== 1 ? 's' : ''} seleccionado{selectedItems.length !== 1 ? 's' : ''}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {fileCount > 0 && (
            <div className="text-sm text-muted-foreground">
              {folderCount > 0 && `${folderCount} carpeta${folderCount !== 1 ? 's' : ''}`}
              {folderCount > 0 && fileCount > 0 && ', '}
              {fileCount > 0 && `${fileCount} archivo${fileCount !== 1 ? 's' : ''}`}
              {totalSize > 0 && ` • ${formatFileSize(totalSize)}`}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction('download')}
            className="text-xs"
          >
            <Download className="h-4 w-4 mr-1" />
            Descargar
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction('share')}
            className="text-xs"
          >
            <Share className="h-4 w-4 mr-1" />
            Compartir
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction('copy')}
            className="text-xs"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copiar
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction('cut')}
            className="text-xs"
          >
            <Scissors className="h-4 w-4 mr-1" />
            Cortar
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction('compress')}
            className="text-xs"
          >
            <Archive className="h-4 w-4 mr-1" />
            Comprimir
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAction('delete')}
            className="text-xs text-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}