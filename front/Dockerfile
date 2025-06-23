FROM node:22-alpine AS vite-app

WORKDIR /app/client

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=vite-app /app/client/dist .

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]