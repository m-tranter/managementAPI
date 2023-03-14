
   
FROM node:18-alpine
COPY . .
WORKDIR /
EXPOSE 3001
RUN npm install
CMD ["node", "app.js"]
