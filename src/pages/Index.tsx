import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoginForm } from "../components/auth/LoginForm";
import { NasLayout } from "../components/NasLayout";
import { AdminPanel } from "../components/admin/AdminPanel";
import { Header } from "../components/layout/Header";
import { FileSystemItem, getFilesByPath, buildFileTree } from "../data/mockFileSystem";
import { Sidebar } from "../components/Sidebar";
import { FileGrid } from "../components/FileGrid";
import { Breadcrumb } from "../components/Breadcrumb";
import { SelectionPanel } from "../components/SelectionPanel";
import { ContextMenu } from "../components/ContextMenu";

const Index = () => {
  const { user, isLoading } = useAuth();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedItems, setSelectedItems] = useState<FileSystemItem[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    items: FileSystemItem[];
    isEmptySpace: boolean;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

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

  if (showAdminPanel && user.role === 'admin') {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Header
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showAdminPanel={showAdminPanel}
          onToggleAdminPanel={() => setShowAdminPanel(!showAdminPanel)}
        />
        <AdminPanel />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showAdminPanel={showAdminPanel}
        onToggleAdminPanel={() => setShowAdminPanel(!showAdminPanel)}
      />

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
};

export default Index;
