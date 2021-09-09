From nginx:stable-alpine

WORKDIR /usr/share/nginx/

RUN apk update && apk upgrade && apk add git && rm -rf html

RUN git clone https://github.com/byujiang/nav.git html && apk del git