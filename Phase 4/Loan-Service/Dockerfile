FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8083
ENV PORT=8083
CMD ["npm", "start"]