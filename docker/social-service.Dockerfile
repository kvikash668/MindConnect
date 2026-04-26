FROM node:18-alpine
WORKDIR /app
COPY services/social-service/package*.json ./
RUN npm ci --only=production
COPY services/social-service/ .
EXPOSE 5003
CMD ["node", "server.js"]
