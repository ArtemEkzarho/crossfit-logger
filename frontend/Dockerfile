FROM node:22.13.0-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:22.13.0-alpine
RUN npm install -g serve

WORKDIR /app
COPY --from=builder /app/dist ./dist

CMD ["serve", "-s", "dist", "-l", "3000"]
