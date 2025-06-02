FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8082
ENV PORT=8082
CMD ["npm", "start"]