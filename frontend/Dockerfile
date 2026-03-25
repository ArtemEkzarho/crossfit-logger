FROM node:22.13.0-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app
COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile --filter crossfit-logger

COPY frontend/ ./frontend/
RUN pnpm --filter crossfit-logger build

FROM node:22.13.0-alpine
RUN npm install -g serve

WORKDIR /app
COPY --from=builder /app/frontend/dist ./dist

CMD ["serve", "-s", "dist", "-l", "3000"]
