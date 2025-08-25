FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN corepack enable && pnpm install
COPY . .
RUN pnpm build
CMD ["node", "dist/server.js"]
