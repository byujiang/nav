From nginx:stable-alpine

WORKDIR /usr/share/nginx/

RUN apk update && apk upgrade && apk add git && rm -rf html && \
	sed -i "s|server_name  localhost;|server_name nav.localhost;|g" /etc/nginx/conf.d/default.conf

# RUN git clone https://github.com/byujiang/nav.git html && apk del git

COPY bin/run.sh /

#CMD ["sh", "/usr/share/nginx/run.sh"]


EXPOSE 443

EXPOSE 80

STOPSIGNAL SIGQUIT

USER $UID

ENTRYPOINT ["/run.sh"]

CMD ["nginx", "-g", "daemon off;"]
