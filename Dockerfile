FROM node:18-alpine
COPY . .
WORKDIR /
EXPOSE 3001
RUN yarn install --production
CMD ["node", "app.js"]
