import { useState, useRef, useEffect, useCallback } from "react";
import { FileSystemItem, formatFileSize } from "../data/mockFileSystem";
import { FileIcon } from "./FileIcon";

interface FileGridProps {
  items: FileSystemItem[];
  selectedItems: FileSystemItem[];
  onSelectionChange: (items: FileSystemItem[]) => void;
  onItemDoubleClick: (item: FileSystemItem) => void;
  onContextMenu: (e: React.MouseEvent, items: FileSystemItem[]) => void;
}

interface SelectionRectangle {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function FileGrid({ 
  items, 
  selectedItems, 
  onSelectionChange, 
  onItemDoubleClick,
  onContextMenu
}: FileGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState<SelectionRectangle | null>(null);
  const [dragStarted, setDragStarted] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only handle left mouse button
    
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    setIsSelecting(true);
    setSelectionRect({
      startX,
      startY,
      endX: startX,
      endY: startY,
    });
    setDragStarted(false);

    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isSelecting || !selectionRect || !gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    setDragStarted(true);
    setSelectionRect(prev => prev ? { ...prev, endX, endY } : null);

    // Calculate which items are within the selection rectangle
    const minX = Math.min(selectionRect.startX, endX);
    const maxX = Math.max(selectionRect.startX, endX);
    const minY = Math.min(selectionRect.startY, endY);
    const maxY = Math.max(selectionRect.startY, endY);

    const itemElements = gridRef.current.querySelectorAll('.file-item');
    const selectedInRect: FileSystemItem[] = [];

    itemElements.forEach((element, index) => {
      const itemRect = element.getBoundingClientRect();
      const gridRect = gridRef.current!.getBoundingClientRect();
      
      const itemX = itemRect.left - gridRect.left;
      const itemY = itemRect.top - gridRect.top;
      const itemRight = itemX + itemRect.width;
      const itemBottom = itemY + itemRect.height;

      if (itemX < maxX && itemRight > minX && itemY < maxY && itemBottom > minY) {
        selectedInRect.push(items[index]);
      }
    });

    onSelectionChange(selectedInRect);
  }, [isSelecting, selectionRect, items, onSelectionChange]);

  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
    setSelectionRect(null);
    setDragStarted(false);
  }, []);

  useEffect(() => {
    if (isSelecting) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isSelecting, handleMouseMove, handleMouseUp]);

  const handleItemClick = (e: React.MouseEvent, item: FileSystemItem) => {
    e.stopPropagation();
    
    if (e.ctrlKey || e.metaKey) {
      // Multi-select with Ctrl/Cmd
      const isSelected = selectedItems.some(selected => selected.id === item.id);
      if (isSelected) {
        onSelectionChange(selectedItems.filter(selected => selected.id !== item.id));
      } else {
        onSelectionChange([...selectedItems, item]);
      }
    } else if (e.shiftKey && selectedItems.length > 0) {
      // Range select with Shift
      const lastSelected = selectedItems[selectedItems.length - 1];
      const startIndex = items.findIndex(i => i.id === lastSelected.id);
      const endIndex = items.findIndex(i => i.id === item.id);
      
      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);
      
      const rangeItems = items.slice(start, end + 1);
      onSelectionChange(rangeItems);
    } else {
      // Single select
      onSelectionChange([item]);
    }
  };

  const handleItemDoubleClick = (e: React.MouseEvent, item: FileSystemItem) => {
    e.stopPropagation();
    onItemDoubleClick(item);
  };

  const handleContextMenuClick = (e: React.MouseEvent, item?: FileSystemItem) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (item) {
      // Right-click on item
      const isItemSelected = selectedItems.some(selected => selected.id === item.id);
      const itemsToUse = isItemSelected ? selectedItems : [item];
      onContextMenu(e, itemsToUse);
    } else {
      // Right-click on empty space
      onContextMenu(e, []);
    }
  };

  const handleGridClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectionChange([]);
    }
  };

  const isItemSelected = (item: FileSystemItem) => 
    selectedItems.some(selected => selected.id === item.id);

  return (
    <div 
      ref={gridRef}
      className="flex-1 p-4 overflow-auto relative select-none"
      onMouseDown={handleMouseDown}
      onClick={handleGridClick}
      onContextMenu={(e) => handleContextMenuClick(e)}
    >
      <div className="file-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className={`file-item ${isItemSelected(item) ? 'selected' : ''}`}
            onClick={(e) => handleItemClick(e, item)}
            onDoubleClick={(e) => handleItemDoubleClick(e, item)}
            onContextMenu={(e) => handleContextMenuClick(e, item)}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <FileIcon 
                type={item.type} 
                extension={item.extension} 
                className="h-8 w-8" 
              />
              <div className="space-y-1">
                <p className="text-sm font-medium truncate w-full">{item.name}</p>
                {item.type === 'file' && item.size && (
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(item.size)}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {item.modified}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selection Rectangle */}
      {isSelecting && selectionRect && dragStarted && (
        <div
          className="selection-rectangle"
          style={{
            left: Math.min(selectionRect.startX, selectionRect.endX),
            top: Math.min(selectionRect.startY, selectionRect.endY),
            width: Math.abs(selectionRect.endX - selectionRect.startX),
            height: Math.abs(selectionRect.endY - selectionRect.startY),
          }}
        />
      )}
    </div>
  );
}