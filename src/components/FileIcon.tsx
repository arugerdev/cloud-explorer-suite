import {
  Folder,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  FileSpreadsheet,
  FileCode,
  Archive,
  Heart,
} from "lucide-react";

interface FileIconProps {
  type: 'folder' | 'file';
  extension?: string;
  className?: string;
}

const getFileIcon = (extension?: string) => {
  if (!extension) return File;
  
  const ext = extension.toLowerCase();
  
  // Documents
  if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) return FileText;
  
  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) return FileImage;
  
  // Videos
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext)) return FileVideo;
  
  // Audio
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'].includes(ext)) return FileAudio;
  
  // Spreadsheets
  if (['xlsx', 'xls', 'csv', 'ods'].includes(ext)) return FileSpreadsheet;
  
  // Code files
  if (['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'php', 'xml', 'json'].includes(ext)) return FileCode;
  
  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return Archive;
  
  return File;
};

const getIconColor = (type: 'folder' | 'file', extension?: string): string => {
  if (type === 'folder') return 'text-folder';
  
  if (!extension) return 'text-file';
  
  const ext = extension.toLowerCase();
  
  // Color coding for different file types
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) return 'text-success';
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext)) return 'text-info';
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'].includes(ext)) return 'text-warning';
  if (['html', 'css', 'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'php'].includes(ext)) return 'text-primary';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'text-destructive';
  
  return 'text-file';
};

export function FileIcon({ type, extension, className = "h-6 w-6" }: FileIconProps) {
  const Icon = type === 'folder' ? Folder : getFileIcon(extension);
  const colorClass = getIconColor(type, extension);
  
  return <Icon className={`${className} ${colorClass}`} />;
}