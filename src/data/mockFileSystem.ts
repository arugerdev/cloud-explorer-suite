export interface FileSystemItem {
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

export const mockFileSystem: FileSystemItem[] = [
  // Root folders
  {
    id: '1',
    name: 'Documentos',
    type: 'folder',
    modified: '2024-01-15 10:30',
    path: '/Documentos',
  },
  {
    id: '2',
    name: 'Fotos',
    type: 'folder',
    modified: '2024-01-14 15:20',
    path: '/Fotos',
  },
  {
    id: '3',
    name: 'Videos',
    type: 'folder',
    modified: '2024-01-13 09:45',
    path: '/Videos',
  },
  {
    id: '4',
    name: 'Música',
    type: 'folder',
    modified: '2024-01-12 14:10',
    path: '/Música',
  },
  {
    id: '5',
    name: 'Proyectos',
    type: 'folder',
    modified: '2024-01-11 16:30',
    path: '/Proyectos',
  },

  // Files in root
  {
    id: '6',
    name: 'README.txt',
    type: 'file',
    size: 1024,
    extension: 'txt',
    modified: '2024-01-10 12:00',
    path: '/README.txt',
  },

  // Documents folder contents
  {
    id: '7',
    name: 'Informe_2024.pdf',
    type: 'file',
    size: 2048000,
    extension: 'pdf',
    modified: '2024-01-15 10:25',
    path: '/Documentos/Informe_2024.pdf',
    parentId: '1',
  },
  {
    id: '8',
    name: 'Presupuesto.xlsx',
    type: 'file',
    size: 512000,
    extension: 'xlsx',
    modified: '2024-01-14 16:40',
    path: '/Documentos/Presupuesto.xlsx',
    parentId: '1',
  },
  {
    id: '9',
    name: 'Contratos',
    type: 'folder',
    modified: '2024-01-13 11:15',
    path: '/Documentos/Contratos',
    parentId: '1',
  },

  // Contracts subfolder
  {
    id: '10',
    name: 'Contrato_Cliente_A.docx',
    type: 'file',
    size: 128000,
    extension: 'docx',
    modified: '2024-01-13 11:10',
    path: '/Documentos/Contratos/Contrato_Cliente_A.docx',
    parentId: '9',
  },
  {
    id: '11',
    name: 'Contrato_Proveedor_B.pdf',
    type: 'file',
    size: 256000,
    extension: 'pdf',
    modified: '2024-01-12 09:30',
    path: '/Documentos/Contratos/Contrato_Proveedor_B.pdf',
    parentId: '9',
  },

  // Photos folder contents
  {
    id: '12',
    name: 'Vacaciones_2024',
    type: 'folder',
    modified: '2024-01-14 15:15',
    path: '/Fotos/Vacaciones_2024',
    parentId: '2',
  },
  {
    id: '13',
    name: 'foto1.jpg',
    type: 'file',
    size: 1024000,
    extension: 'jpg',
    modified: '2024-01-14 14:30',
    path: '/Fotos/foto1.jpg',
    parentId: '2',
  },
  {
    id: '14',
    name: 'foto2.png',
    type: 'file',
    size: 2048000,
    extension: 'png',
    modified: '2024-01-14 14:25',
    path: '/Fotos/foto2.png',
    parentId: '2',
  },

  // Vacation photos
  {
    id: '15',
    name: 'playa1.jpg',
    type: 'file',
    size: 1536000,
    extension: 'jpg',
    modified: '2024-01-14 15:10',
    path: '/Fotos/Vacaciones_2024/playa1.jpg',
    parentId: '12',
  },
  {
    id: '16',
    name: 'playa2.jpg',
    type: 'file',
    size: 1728000,
    extension: 'jpg',
    modified: '2024-01-14 15:05',
    path: '/Fotos/Vacaciones_2024/playa2.jpg',
    parentId: '12',
  },

  // Videos folder contents
  {
    id: '17',
    name: 'video_presentacion.mp4',
    type: 'file',
    size: 52428800,
    extension: 'mp4',
    modified: '2024-01-13 09:40',
    path: '/Videos/video_presentacion.mp4',
    parentId: '3',
  },
  {
    id: '18',
    name: 'tutorial.avi',
    type: 'file',
    size: 104857600,
    extension: 'avi',
    modified: '2024-01-12 18:20',
    path: '/Videos/tutorial.avi',
    parentId: '3',
  },

  // Music folder contents
  {
    id: '19',
    name: 'cancion1.mp3',
    type: 'file',
    size: 4194304,
    extension: 'mp3',
    modified: '2024-01-12 14:05',
    path: '/Música/cancion1.mp3',
    parentId: '4',
  },
  {
    id: '20',
    name: 'album_favorito.flac',
    type: 'file',
    size: 16777216,
    extension: 'flac',
    modified: '2024-01-11 20:30',
    path: '/Música/album_favorito.flac',
    parentId: '4',
  },

  // Projects folder contents
  {
    id: '21',
    name: 'Proyecto_Web',
    type: 'folder',
    modified: '2024-01-11 16:25',
    path: '/Proyectos/Proyecto_Web',
    parentId: '5',
  },
  {
    id: '22',
    name: 'App_Movil',
    type: 'folder',
    modified: '2024-01-10 12:15',
    path: '/Proyectos/App_Movil',
    parentId: '5',
  },

  // Web project files
  {
    id: '23',
    name: 'index.html',
    type: 'file',
    size: 8192,
    extension: 'html',
    modified: '2024-01-11 16:20',
    path: '/Proyectos/Proyecto_Web/index.html',
    parentId: '21',
  },
  {
    id: '24',
    name: 'styles.css',
    type: 'file',
    size: 4096,
    extension: 'css',
    modified: '2024-01-11 16:15',
    path: '/Proyectos/Proyecto_Web/styles.css',
    parentId: '21',
  },
  {
    id: '25',
    name: 'script.js',
    type: 'file',
    size: 12288,
    extension: 'js',
    modified: '2024-01-11 16:10',
    path: '/Proyectos/Proyecto_Web/script.js',
    parentId: '21',
  },

  // Mobile app files
  {
    id: '26',
    name: 'MainActivity.java',
    type: 'file',
    size: 16384,
    extension: 'java',
    modified: '2024-01-10 12:10',
    path: '/Proyectos/App_Movil/MainActivity.java',
    parentId: '22',
  },
  {
    id: '27',
    name: 'AndroidManifest.xml',
    type: 'file',
    size: 2048,
    extension: 'xml',
    modified: '2024-01-10 12:05',
    path: '/Proyectos/App_Movil/AndroidManifest.xml',
    parentId: '22',
  },
];

export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

export const getFilesByPath = (path: string): FileSystemItem[] => {
  if (path === '/') {
    return mockFileSystem.filter(item => !item.parentId);
  }
  
  const parentItem = mockFileSystem.find(item => item.path === path);
  if (!parentItem) return [];
  
  return mockFileSystem.filter(item => item.parentId === parentItem.id);
};

export const buildFileTree = (): FileSystemItem[] => {
  const rootItems = mockFileSystem.filter(item => !item.parentId);
  
  const addChildren = (item: FileSystemItem): FileSystemItem => {
    const children = mockFileSystem.filter(child => child.parentId === item.id);
    return {
      ...item,
      children: children.map(addChildren)
    };
  };
  
  return rootItems.map(addChildren);
};