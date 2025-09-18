# Cloud Explorer Suite

Un moderno sistema de gestión de archivos en la nube con panel de administración integrado.

## 🚀 Características

- 🔐 **Sistema de autenticación JWT** - Login seguro con roles de usuario
- 👑 **Panel de administración** - Solo para usuarios admin
- 📁 **Explorador de archivos** - Interfaz tipo explorador de carpetas
- 🎨 **Diseño moderno** - UI clean con modo oscuro por defecto
- 📱 **Responsive** - Optimizado para móviles y escritorio
- ⚡ **API REST** - Integración con FastAPI backend

## 🛠️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` y configura:

```bash
# URL del backend FastAPI
VITE_API_URL=http://storage.aruger.dev/api
```

### Usuarios de Prueba

- **Admin**: `admin` / `admin123`
- **Usuario**: `user1` / `user123`

## 📡 Endpoints del Backend (FastAPI)

### Autenticación
- `POST /api/login` - Login de usuario
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

### Administración (Solo Admin)
- `GET /api/users` - Lista de usuarios
- `DELETE /api/users/{userId}` - Eliminar usuario
- `POST /api/users/{userId}/reset-password` - Resetear contraseña
- `GET /api/admin/storage-stats` - Estadísticas de almacenamiento

### Archivos
- `GET /api/storage/{username}` - Archivos del usuario
- `POST /api/upload` - Subir archivo
- `POST /api/download` - Descargar archivo

---

**Project URL**: https://lovable.dev/projects/88012a44-ad10-47b0-ac78-90f0c0068054

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/88012a44-ad10-47b0-ac78-90f0c0068054) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/88012a44-ad10-47b0-ac78-90f0c0068054) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
