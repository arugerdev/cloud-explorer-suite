import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  const pathParts = path === '/' ? [] : path.split('/').filter(Boolean);
  
  const buildPath = (index: number): string => {
    if (index === -1) return '/';
    return '/' + pathParts.slice(0, index + 1).join('/');
  };

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <button
        onClick={() => onNavigate('/')}
        className="flex items-center hover:text-foreground transition-colors p-1 rounded"
      >
        <Home className="h-4 w-4" />
      </button>
      
      {pathParts.map((part, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4" />
          <button
            onClick={() => onNavigate(buildPath(index))}
            className="hover:text-foreground transition-colors p-1 rounded font-medium"
          >
            {part}
          </button>
        </div>
      ))}
    </nav>
  );
}