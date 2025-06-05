# Etapa de construcción
FROM node:20-slim AS builder

# 1. Usa el usuario node existente en la imagen
WORKDIR /app

# 2. Asegura permisos correctos
RUN chown -R node:node /app
USER node

# 3. Copia e instala dependencias
COPY --chown=node:node package*.json ./
RUN npm install

# 4. Copia el resto de archivos
COPY --chown=node:node . .

# 5. Ejecuta el build
RUN npm run build

# Etapa de producción
FROM node:20-slim AS runner

# 1. Configura directorio y permisos
WORKDIR /app
RUN chown -R node:node /app
USER node

# 2. Copia archivos construidos
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package.json ./

# 3. Instala solo vite
RUN npm install --omit=dev vite

EXPOSE 4173

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "4173"]