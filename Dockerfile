From nginx:latest

RUN apt update -y && apt upgrade -y && apt install -y git

RUN cd /usr/share/nginx/ && rm -rf html \
git clone https://github.com/byujiang/nav.git html
