# Imagen para desarrollo local con docker compose (en producción el frontend lo sirve Vercel).
# Astro 7 necesita Node >= 22.23.4
FROM node:24-alpine

# Define el directorio de trabajo dentro del contenedor; todo corre sin privilegios de root
WORKDIR /app
RUN chown node:node /app
USER node

# Instala exactamente lo que fija package-lock.json
COPY --chown=node:node package*.json ./
RUN npm ci --no-audit --no-fund

# Copia el resto de la aplicación
COPY --chown=node:node . .

# Expone el puerto donde corre el frontend
EXPOSE 8001

# Inicia la aplicación con el comando de desarrollo de Astro, asegurando que el servidor sea accesible desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]
