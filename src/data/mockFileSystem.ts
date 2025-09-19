import { apiService } from "../services/api";

export interface FileSystemItem {
  isEditing: boolean;
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: number;
  modified: string;
  parentId?: string;
  path: string;
  extension?: string;
  isExpanded?: boolean;
  children?: FileSystemItem[];
}

export const getFilesByPath = async (path: string): Promise<FileSystemItem[]> => {
  try {
    const username = (await apiService.getCurrentUser())?.username;
    if (!username) return [];

    // Pedimos al backend solo la carpeta actual
    const files = await apiService.getUserFiles(path);

    return files.map(f => ({
      ...f,
      isExpanded: false,
      children: f.type === "folder" ? [] : undefined,
    }));
  } catch (err) {
    console.error("Error obteniendo archivos:", err);
    return [];
  }
};




export const buildFileTree = async (): Promise<FileSystemItem[]> => {
  try {
    const username = (await apiService.getCurrentUser())?.username;
    if (!username) return [];

    const allFiles = await apiService.getUserFiles("/");

    const rootItems = allFiles.filter(f => !f.parentId);

    const addChildren = (item: FileSystemItem): FileSystemItem => {
      const children = allFiles.filter(f => f.parentId === item.id);
      return {
        ...item,
        children: children.map(addChildren),
      };
    };

    return rootItems.map(addChildren);
  } catch (err) {
    console.error("Error construyendo árbol de archivos:", err);
    return [];
  }
};

// Formatear tamaños
export const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};
