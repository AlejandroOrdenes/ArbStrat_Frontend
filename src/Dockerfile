# Usa una imagen de Node.js
FROM node:14-alpine

# Establece el directorio de trabajo en la aplicación
WORKDIR /app

# Copia los archivos de la aplicación al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Construye la aplicación React para producción
RUN npm run build

# Expone el puerto 80
EXPOSE 80

# Comando para ejecutar la aplicación cuando el contenedor se inicia
CMD ["npm", "start"]
