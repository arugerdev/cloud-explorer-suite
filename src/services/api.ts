import { getApiUrl } from '../config/api';
import { LoginRequest, LoginResponse, User, StorageStats, ApiError } from '../types/auth';
import { FileSystemItem } from '../data/mockFileSystem';
import { jwtDecode } from 'jwt-decode';
class ApiService {
  renameItem(path: string, newName: string) {
    return fetch(getApiUrl('/rename'), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ path, newName }),
    }).then(response => this.handleResponse<void>(response));
  }
  createItem(arg0: { type: "folder" | "file"; name: string; path: string; }) {
    if (arg0.type === "folder") {
      return this.createFolder(`${arg0.path}/${arg0.name}`);
    }
    if (arg0.type === "file") {
      return this.createFile(`${arg0.path}/${arg0.name}`);
    }
    throw new Error("Tipo de item no soportado");
  }
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: await response.text(),
        status: response.status,
      };
      throw error;
    }
    return response.json();
  }

  // --------------------
  // Authentication
  // --------------------
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(getApiUrl('/login'), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    const data = await this.handleResponse<LoginResponse>(response);
    localStorage.setItem('auth_token', data.access_token);
    return data;
  }


  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
  }

  // Obtener usuario actual desde JWT
  getCurrentUser(tokenOverride?: string): User | null {
    const token = tokenOverride || this.getToken();
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return {
        username: decoded.sub,
        role: decoded.is_admin ? 'admin' : 'user',
      } as User;
    } catch (err) {
      console.error('Token inválido:', err);
      return null;
    }
  }



  // --------------------
  // Admin endpoints
  // --------------------
  async getUsers(): Promise<User[]> {
    const response = await fetch(getApiUrl('/users'), {
      headers: this.getHeaders(),
    });
    return this.handleResponse<User[]>(response);
  }

  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(getApiUrl(`/users/${userId}`), {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    await this.handleResponse<void>(response);
  }

  async resetUserPassword(userId: string, newPassword: string): Promise<void> {
    const response = await fetch(getApiUrl(`/users/${userId}/reset-password`), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ password: newPassword }),
    });
    await this.handleResponse<void>(response);
  }

  async getStorageStats(): Promise<StorageStats> {
    const response = await fetch(getApiUrl('/admin/storage-stats'), {
      headers: this.getHeaders(),
    });
    return this.handleResponse<StorageStats>(response);
  }

  // --------------------
  // File operations
  // --------------------
  async getUserFiles(path: string = '/'): Promise<FileSystemItem[]> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Usuario no autenticado');
    const response = await fetch(getApiUrl(`/storage/${user.username}?path=${encodeURIComponent(path)}`), {
      headers: this.getHeaders(),
    });
    return this.handleResponse<FileSystemItem[]>(response);
  }

  async uploadFile(file: File, path: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const token = this.getToken();
    const response = await fetch(getApiUrl('/upload'), {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    await this.handleResponse<void>(response);
  }

  async downloadFile(filePath: string): Promise<Blob> {
    const formData = new FormData();
    formData.append("path", filePath);
    console.log(filePath);

    const token = this.getToken();
    const response = await fetch(getApiUrl('/download'), {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData
    });

    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  }

  async deleteFiles(filePaths: string[]): Promise<void> {
    const response = await fetch(getApiUrl('/delete'), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ paths: filePaths }),
    });
    await this.handleResponse<void>(response);
  }

  async createFolder(path: string): Promise<void> {
    const response = await fetch(getApiUrl('/create-folder'), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ path }),
    });
    await this.handleResponse<void>(response);
  }
  async createFile(path: string): Promise<void> {
    const response = await fetch(getApiUrl('/create-file'), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ path }), // path completo incluyendo nombre del archivo
    });
    await this.handleResponse<void>(response);
  }
}

export const apiService = new ApiService();
