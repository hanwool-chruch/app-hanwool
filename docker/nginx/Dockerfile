FROM node:12
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY client/package*.json ./
RUN npm install
COPY client/ .
COPY ./tsconfig.json ../
RUN npm run build

FROM nginx
RUN rm -rf /etc/nginx/conf.d
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]