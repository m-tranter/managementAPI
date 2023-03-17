FROM node:18-alpine
COPY . .
WORKDIR /
EXPOSE 3001
ARG ROOT_URL
ENV ROOT_URL=${ROOT_URL}
RUN yarn install --production
CMD ["node", "app.js"]
