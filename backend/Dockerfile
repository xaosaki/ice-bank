FROM node:20-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y python3 build-essential libpq-dev nano && \
    rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

RUN apt-get remove -y python3 build-essential && apt-get autoremove -y

EXPOSE 3000
CMD ["node", "dist/src/main"]