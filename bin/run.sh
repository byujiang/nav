#!/bin/sh

cd /usr/share/nginx/

if [[ ! -f /usr/share/nginx/OK ]]; then
	git clone https://github.com/byujiang/nav html
	touch /usr/share/nginx/OK
fi


#if [[ -d /usr/share/nginx/html ]]; then
#	cd html; git pull
#else
#fi

exec "$@"
#nginx -g daemon off
