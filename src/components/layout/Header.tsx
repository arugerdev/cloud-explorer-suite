import { Button } from '../ui/button';
import { ThemeToggle } from '../ThemeToggle';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Menu, Search, Settings, LogOut, User, Shield } from 'lucide-react';
import { Input } from '../ui/input';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showAdminPanel: boolean;
  onToggleAdminPanel: () => void;
}

export const Header = ({ 
  onToggleSidebar, 
  searchQuery, 
  onSearchChange, 
  showAdminPanel, 
  onToggleAdminPanel 
}: HeaderProps) => {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="h-8 w-8 p-0"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        <h1 className="text-lg font-semibold">Cloud Explorer Suite</h1>
        
        {isAdmin && (
          <Badge variant="secondary" className="ml-2">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar archivos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          {isAdmin && (
            <Button
              variant={showAdminPanel ? "default" : "ghost"}
              size="sm"
              onClick={onToggleAdminPanel}
              className="h-8"
            >
              <Settings className="h-4 w-4 mr-1" />
              Admin
            </Button>
          )}
          
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5 text-sm">
                <div className="font-medium">{user.username}</div>
                <div className="text-muted-foreground">{user.email}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};