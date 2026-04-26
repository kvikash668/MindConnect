FROM node:18-alpine
WORKDIR /app
COPY services/user-service/package*.json ./
RUN npm ci --only=production
COPY services/user-service/ .
EXPOSE 5002
CMD ["node", "server.js"]
