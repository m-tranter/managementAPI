FROM node:18-alpine
COPY . .
WORKDIR /
EXPOSE 3001
ARG CLIENT_ID
ARG CLIENT_SECRET
ARG ROOT_URL
ENV CLIENT_ID=${{secrets.CLIENT_ID}}
ENV CLIENT_SECRET=${{secrets.CLIENT_SECRET}}
ENV ROOT_URL=${{secrets.ROOT_URL}}
RUN echo Root url: $ROOT_URL
RUN yarn install --production
CMD ["node", "app.js"]
