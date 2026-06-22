# Stage 1: Build Vite SPA
FROM node:20-alpine AS builder
WORKDIR /app

# Copia os arquivos de dependência do frontend e instala
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copia todos os arquivos do projeto e faz o build
COPY . .
RUN cd frontend && npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copia os estáticos compilados do estágio anterior
COPY --from=builder /app/frontend/dist .

# Configuração para Nginx com suporte a roteamento SPA (fallback para index.html)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
