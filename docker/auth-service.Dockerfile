FROM node:18-alpine
WORKDIR /app
COPY services/auth-service/package*.json ./
RUN npm ci --only=production
COPY services/auth-service/ .
EXPOSE 5001
CMD ["node", "server.js"]
