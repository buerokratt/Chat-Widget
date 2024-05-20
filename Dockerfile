ARG node_version=node:lts
ARG nginx_version=nginx:alpine


FROM $node_version as image
WORKDIR /usr/app
COPY ./package*.json ./

FROM image AS build
RUN npm pkg set scripts.prepare=" "
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run webpack

FROM $nginx_version
RUN  touch /var/run/nginx.pid && \
     chown -R nginx:nginx /var/cache/nginx /var/run/nginx.pid
USER nginx
COPY --chown=nginx:nginx ./nginx/http-nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx --from=build ./usr/app/dist /usr/share/nginx/html/widget
COPY --chown=nginx:nginx ./public/favicon.ico /usr/share/nginx/html/widget
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
