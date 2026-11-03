# Usa una imagen base de Node.js
FROM node:18-alpine

# Define el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias y luego instala
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copia el resto de la aplicación
COPY . .


# Expone el puerto donde corre el frontend (puedes cambiarlo si es necesario)
EXPOSE 8001

# Inicia la aplicación con el comando de desarrollo de Astro, asegurando que el servidor sea accesible desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host"]

