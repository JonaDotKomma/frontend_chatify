# Etapa de construcción
FROM node:alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --silent
COPY . ./
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
