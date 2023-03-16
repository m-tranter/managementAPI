FROM node:18-alpine
COPY . .
WORKDIR /
EXPOSE 3001

RUN echo Root url: $ROOT_URL
RUN yarn install --production
CMD ["node", "app.js"]
