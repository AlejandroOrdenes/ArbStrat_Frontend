# Etapa de construcción
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de ejecución
FROM nginx:alpine
ADD ./config/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /var/www/app
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



