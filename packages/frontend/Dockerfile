# packages/frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY ../../package.json ../../turbo.json ./
COPY ./package.json ./tsconfig.json ./vite.config.* ./src ./public ./
RUN npm ci
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=builder /app/dist/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
