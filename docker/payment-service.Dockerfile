FROM node:18-alpine
WORKDIR /app
COPY services/payment-service/package*.json ./
RUN npm ci --only=production
COPY services/payment-service/ .
EXPOSE 5004
CMD ["node", "server.js"]
