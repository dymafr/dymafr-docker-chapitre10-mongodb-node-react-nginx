FROM node:alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --only=production
COPY . .
EXPOSE 80
CMD ["node", "src/index.js"]