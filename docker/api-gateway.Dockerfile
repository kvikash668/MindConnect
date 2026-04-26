FROM node:18-alpine
WORKDIR /app
COPY services/api-gateway/package*.json ./
RUN npm ci --only=production
COPY services/api-gateway/ .
EXPOSE 3000
CMD ["node", "server.js"]
