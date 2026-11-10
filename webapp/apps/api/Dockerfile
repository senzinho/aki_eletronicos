FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci

COPY apps/api apps/api

ENV DATABASE_URL="mysql://user:pass@localhost:3306/db"
RUN npm exec --workspace apps/api -- prisma generate --schema prisma/schema.prisma
RUN npm run build --workspace apps/api

RUN npm prune --omit=dev

FROM node:22-alpine AS runtime
WORKDIR /app/apps/api
ENV NODE_ENV=production

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/api/node_modules /app/apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
RUN mkdir -p uploads

EXPOSE 3012
CMD ["node", "dist/main.js"]
