# Red de Innovación FP

[Previous content remains the same until "Características Técnicas"]

## Instrucciones de Instalación

### 1. Instalación en Ubuntu Server

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js y npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar Git
sudo apt install -y git

# Clonar el repositorio
git clone https://github.com/tu-usuario/red-innovacion-fp.git
cd red-innovacion-fp

# Instalar dependencias
npm install

# Construir la aplicación
npm run build

# Instalar PM2 para gestionar el proceso
sudo npm install -g pm2

# Iniciar la aplicación
pm2 start npm --name "red-innovacion" -- start

# Configurar PM2 para iniciar con el sistema
pm2 startup
pm2 save
```

### 2. Instalación en Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5173

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5173:5173"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Para ejecutar con Docker Compose:
```bash
docker-compose up -d
```

### 3. Instalación en Portainer

1. Acceder a Portainer
2. Ir a "Stacks" → "Add stack"
3. Copiar el contenido del docker-compose.yml
4. Configurar variables de entorno si es necesario
5. Hacer clic en "Deploy the stack"

### 4. Instalación en Proxmox

1. Crear un contenedor LXC en Proxmox:
```bash
# Crear contenedor Ubuntu
pct create 100 local:vztmpl/ubuntu-22.04-standard_22.04-1_amd64.tar.zst

# Configurar recursos
pct set 100 -cores 2
pct set 100 -memory 2048
pct set 100 -swap 1024
pct set 100 -net0 name=eth0,bridge=vmbr0,ip=dhcp

# Iniciar contenedor
pct start 100
```

2. Acceder al contenedor:
```bash
pct enter 100
```

3. Seguir los pasos de instalación de Ubuntu Server mencionados anteriormente.

### Requisitos del Sistema

- Node.js 18 o superior
- NPM 8 o superior
- 2GB RAM mínimo
- 10GB espacio en disco
- Conexión a Internet

### Configuración de Producción

1. Configurar variables de entorno:
```bash
cp .env.example .env
```

2. Editar `.env`:
```env
NODE_ENV=production
VITE_API_URL=https://tu-api.com
```

3. Configurar proxy inverso (Nginx ejemplo):
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Mantenimiento

- **Backups**:
  ```bash
  # Backup de la base de datos
  tar -czf backup-$(date +%F).tar.gz ./data

  # Restaurar backup
  tar -xzf backup-YYYY-MM-DD.tar.gz
  ```

- **Actualizaciones**:
  ```bash
  # Actualizar dependencias
  npm update

  # Reconstruir la aplicación
  npm run build

  # Reiniciar servicio
  pm2 restart red-innovacion
  ```

- **Logs**:
  ```bash
  # Ver logs en tiempo real
  pm2 logs red-innovacion

  # Rotar logs
  pm2 flush
  ```

### Solución de Problemas

1. **Error de permisos**:
```bash
sudo chown -R $USER:$USER /ruta/aplicacion
```

2. **Puerto en uso**:
```bash
sudo lsof -i :5173
kill -9 PID
```

3. **Problemas de memoria**:
```bash
# Aumentar límite de archivos
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Seguridad

1. Configurar firewall:
```bash
sudo ufw allow 5173
sudo ufw enable
```

2. Configurar SSL con Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

Para más información, consulta la [documentación oficial](https://github.com/tu-usuario/red-innovacion-fp/docs).