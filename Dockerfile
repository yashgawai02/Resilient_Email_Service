FROM node:18
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY src src
EXPOSE 3000
CMD ["npx", "ts-node", "src/server.ts"]
