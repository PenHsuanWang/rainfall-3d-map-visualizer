# packages/backend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY ../../package.json ../../turbo.json ./
COPY ../../packages/common ./packages/common
COPY ./package.json ./tsconfig.json ./src/ ./                       # copy backend only
RUN npm ci
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
EXPOSE 3000
