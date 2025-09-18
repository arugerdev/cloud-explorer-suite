import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import { apiService } from '../../services/api';
import { User, StorageStats } from '../../types/auth';
import { formatFileSize } from '../../data/mockFileSystem';
import { Users, HardDrive, Trash2, RefreshCw, Settings, Database } from 'lucide-react';

export const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, statsData] = await Promise.all([
        apiService.getUsers(),
        apiService.getStorageStats(),
      ]);
      setUsers(usersData);
      setStorageStats(statsData);
    } catch (error) {
      toast({
        title: "Error al cargar datos",
        description: "No se pudieron cargar los datos del panel de administración",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el usuario "${username}"?`)) {
      return;
    }

    try {
      await apiService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast({
        title: "Usuario eliminado",
        description: `El usuario "${username}" ha sido eliminado correctamente`,
      });
    } catch (error) {
      toast({
        title: "Error al eliminar usuario",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      toast({
        title: "Error",
        description: "La contraseña no puede estar vacía",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiService.resetUserPassword(selectedUserId, newPassword);
      toast({
        title: "Contraseña restablecida",
        description: "La contraseña del usuario ha sido restablecida correctamente",
      });
      setIsResetDialogOpen(false);
      setNewPassword('');
      setSelectedUserId('');
    } catch (error) {
      toast({
        title: "Error al restablecer contraseña",
        description: "No se pudo restablecer la contraseña",
        variant: "destructive",
      });
    }
  };

  const storageUsagePercentage = storageStats 
    ? Math.round((storageStats.usedStorage / storageStats.totalStorage) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona usuarios y almacenamiento del sistema</p>
        </div>
        <Button onClick={loadData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Storage Stats */}
      {storageStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Almacenamiento Total</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(storageStats.totalStorage)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Espacio Usado</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(storageStats.usedStorage)}</div>
              <p className="text-xs text-muted-foreground">
                {storageUsagePercentage}% del total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Espacio Libre</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(storageStats.availableStorage)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Registrados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storageStats.userCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
          <CardDescription>
            Gestiona todos los usuarios registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Espacio Usado</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{formatFileSize(user.storageUsed)}</span>
                      <span className="text-xs text-muted-foreground">
                        de {formatFileSize(user.storageLimit)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog open={isResetDialogOpen && selectedUserId === user.id} onOpenChange={setIsResetDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUserId(user.id)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Restablecer Contraseña</DialogTitle>
                            <DialogDescription>
                              Establece una nueva contraseña para {user.username}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">Nueva Contraseña</Label>
                              <Input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Introduce la nueva contraseña"
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                                Cancelar
                              </Button>
                              <Button onClick={handleResetPassword}>
                                Restablecer
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {user.role !== 'admin' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.username)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};