FROM node:22.13.0-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_API_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN pnpm build

FROM node:22.13.0-alpine
RUN npm install -g serve

WORKDIR /app
COPY --from=builder /app/dist ./dist

CMD ["serve", "-s", "dist"]
