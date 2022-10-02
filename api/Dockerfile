FROM node:alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY --chown=node:node . .
EXPOSE 80
CMD [ "npm", "start" ]