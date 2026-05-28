FROM node:20-slim AS base

# 1. Instalar dependencias solo cuando sea necesario
FROM base AS deps
RUN apt-get update && apt-get install -y openssl python3 make g++ libc6-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

# 2. Reconstruir el código fuente solo cuando sea necesario
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables requeridas durante el build (solo estructurales)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN yarn build

# 3. Imagen de producción (Runner) - Extremadamente ligera
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Instalar librerías de sistema que SQLite pueda requerir en runtime
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Solo copiamos los archivos de producción absolutamente necesarios
COPY --from=builder /app/public ./public

# Automáticamente generados por "output: standalone" en next.config.ts
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js es generado automáticamente por Next.js standalone
CMD ["node", "server.js"]
