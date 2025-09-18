import { useState } from "react";
import { FileSystemItem, getFilesByPath } from "../data/mockFileSystem";
import { Sidebar } from "./Sidebar";
import { FileGrid } from "./FileGrid";
import { Breadcrumb } from "./Breadcrumb";
import { SelectionPanel } from "./SelectionPanel";
import { ContextMenu } from "./ContextMenu";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, Search, Settings, Grid3X3, List } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function NasLayout() {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedItems, setSelectedItems] = useState<FileSystemItem[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    items: FileSystemItem[];
    isEmptySpace: boolean;
  } | null>(null);

  const currentItems = getFilesByPath(currentPath);
  const filteredItems = currentItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedItems([]);
  };

  const handleItemDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      handleNavigate(item.path);
    } else {
      // Simulate file download/open
      console.log('Abriendo/descargando archivo:', item);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, items: FileSystemItem[]) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items,
      isEmptySpace: items.length === 0,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <h1 className="text-lg font-semibold">NAS Cloud Storage</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar archivos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="h-8 w-8 p-0"
              title={`Cambiar a vista ${viewMode === 'grid' ? 'lista' : 'cuadrícula'}`}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Configuración"
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!sidebarCollapsed && (
          <aside className="w-80 border-r border-border bg-card">
            <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Breadcrumb */}
          <div className="h-12 border-b border-border bg-card px-4 flex items-center">
            <Breadcrumb path={currentPath} onNavigate={handleNavigate} />
          </div>

          {/* File Grid */}
          <div className="flex-1 overflow-hidden">
            <FileGrid
              items={filteredItems}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              onItemDoubleClick={handleItemDoubleClick}
              onContextMenu={handleContextMenu}
            />
          </div>

          {/* Selection Panel */}
          <SelectionPanel
            selectedItems={selectedItems}
            onClearSelection={() => setSelectedItems([])}
          />
        </main>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          isEmptySpace={contextMenu.isEmptySpace}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
}