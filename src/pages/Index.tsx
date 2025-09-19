import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoginForm } from "../components/auth/LoginForm";
import { AdminPanel } from "../components/admin/AdminPanel";
import { Header } from "../components/layout/Header";
import { FileSystemItem } from "../data/mockFileSystem";
import { Sidebar } from "../components/Sidebar";
import { FileGrid } from "../components/FileGrid";
import { Breadcrumb } from "../components/Breadcrumb";
import { SelectionPanel } from "../components/SelectionPanel";
import { ContextMenu } from "../components/ContextMenu";
import { apiService } from "../services/api";

const Index = () => {
  const { user, isLoading } = useAuth();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [selectedItems, setSelectedItems] = useState<FileSystemItem[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [newItem, setNewItem] = useState<FileSystemItem | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    items: FileSystemItem[];
    isEmptySpace: boolean;
  } | null>(null);

  // 🔹 Estado para guardar archivos cargados
  const [currentItems, setCurrentItems] = useState<FileSystemItem[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [sidebarVersion, setSidebarVersion] = useState(0);
  const [draggingFiles, setDraggingFiles] = useState<File[]>([]);

  const reloadSidebar = () => setSidebarVersion(prev => prev + 1);

  // 🔹 Cargar archivos cuando cambia el path o el usuario
  useEffect(() => {
    if (!user) return;

    const loadFiles = async () => {
      try {
        setLoadingFiles(true);
        // ✅ pedir al backend los archivos del path actual
        const files = await apiService.getUserFiles(currentPath);
        setCurrentItems(files);
      } catch (err) {
        console.error("Error obteniendo archivos:", err);
        setCurrentItems([]);
      } finally {
        setLoadingFiles(false);
      }
    };

    loadFiles();
  }, [currentPath, user]);


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.items && e.dataTransfer.items[0].kind === "file") {
      setDraggingFiles(Array.from(e.dataTransfer.items) as unknown as File[]);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingFiles([]);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    setDraggingFiles([]);

    try {
      for (const file of files) {
        await apiService.uploadFile(file, currentPath);
      }
      reloadFiles();
      reloadSidebar();
    } catch (err) {
      console.error("Error subiendo archivos:", err);
    }
  };
  const reloadFiles = async () => {
    if (!user) return;
    try {
      setLoadingFiles(true);
      const files = await apiService.getUserFiles(currentPath);
      setCurrentItems(files);
    } catch (err) {
      console.error("Error obteniendo archivos:", err);
      setCurrentItems([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  function startCreateItem(type: "folder" | "file") {
    const baseName = type === "folder" ? "Nueva Carpeta" : "Nuevo Archivo.txt";
    let name = baseName;
    let counter = 1;
    const existingNames = currentItems.map(i => i.name);
    while (existingNames.includes(name)) {
      name = type === "folder" ? `Nueva Carpeta (${counter})` : `Nuevo Archivo (${counter}).txt`;
      counter++;
    }

    setNewItem({
      id: `temp-${Date.now()}`,
      name,
      path: currentPath + "/" + name,
      type,
      isEditing: true,
    } as unknown as FileSystemItem);
  }

  const filteredItems = [...currentItems, ...(newItem ? [newItem] : [])].filter((item) =>
    (item?.name) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedItems([]);
  };

  const handleItemDoubleClick = (item: FileSystemItem) => {
    if (item.type === "folder") {
      handleNavigate(item.path);
    } else {
      console.log("Abrir/descargar archivo:", item);
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

  const closeContextMenu = () => setContextMenu(null);

  const handleFinishEditing = async (item: FileSystemItem, newName: string, cancelled?: boolean) => {
    if (item.id.startsWith("temp-")) {
      if (cancelled) { setNewItem(null); return; }
      try {
        await apiService.createItem({ type: item.type, name: newName || item.name, path: currentPath });
        reloadFiles();
        reloadSidebar(); // ✅ recargar sidebar
      } catch (err) { console.error(err); }
      finally { setNewItem(null); }
    } else {
      if (cancelled) { return; }
      try {
        await apiService.renameItem(item.path, newName);
        reloadFiles();
        reloadSidebar(); // ✅ recargar sidebar
      } catch (err) { console.error(err); }
    }
  };

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

  if (showAdminPanel && user.role === "admin") {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Header
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showAdminPanel={showAdminPanel}
          onToggleAdminPanel={() => setShowAdminPanel(!showAdminPanel)}
        // viewMode={viewMode}
        // onToggleViewMode={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
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
      // viewMode={viewMode}
      // onToggleViewMode={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
      />

      <div className="flex flex-1 overflow-hidden">
        {!sidebarCollapsed && (
          <aside className="w-80 border-r border-border bg-card">
            <Sidebar currentPath={currentPath} onNavigate={handleNavigate} reloadTrigger={sidebarVersion} />
          </aside>
        )}

        <main
          className="flex-1 flex flex-col overflow-hidden"
          onContextMenu={(e) => {
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY, items: [], isEmptySpace: true });
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="h-12 border-b border-border bg-card px-4 flex items-center">
            <Breadcrumb path={currentPath} onNavigate={handleNavigate} />
          </div>

          <div className="flex-1 overflow-hidden">
            {loadingFiles ? (
              <p className="p-4 text-muted-foreground">Cargando archivos...</p>
            ) : (
              <FileGrid
                items={filteredItems}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                onItemDoubleClick={handleItemDoubleClick}
                onContextMenu={handleContextMenu}
                onFinishEditing={handleFinishEditing}
              // viewMode={viewMode}
              />
            )}
            {draggingFiles.length > 0 && (
              <div className="absolute inset-0 z-50 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-lg font-semibold pointer-events-none">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v8m0 0l-4-4m4 4l4-4m0-8V4m0 0l-4 4m4-4l4 4" />
                  </svg>
                  <span>Suelta para subir {draggingFiles.length} archivo(s)</span>
                </div>
              </div>
            )}
          </div>

          <SelectionPanel selectedItems={selectedItems} onClearSelection={() => setSelectedItems([])} />
        </main>
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          isEmptySpace={contextMenu.isEmptySpace}
          onClose={closeContextMenu}
          startCreateItem={startCreateItem}
          reloadFiles={reloadFiles}
          reloadSidebar={reloadSidebar}
        />
      )}
    </div>
  );
};

export default Index;