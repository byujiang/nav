From nginx:stable-alpine

RUN apk update && apk upgrade && apk add git

RUN cd /usr/share/nginx/ && rm -rf html && \
git clone https://github.com/byujiang/nav.git html &&\
apk del git