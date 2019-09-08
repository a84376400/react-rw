#!/bin/sh

IP=${IP:="127.0.0.1"}
SUBTITLE=${SUBTITLE:="瑞威光电控制台"}
echo "IP:$IP"
echo "SUBTITLE:$SUBTITLE"

sed -i s/127.0.0.1/${IP}/g /usr/share/nginx/html/setting.js \
  && sed -i s/localhost/${IP}/g /usr/share/nginx/html/setting.js \
  && sed -i s/瑞威光电控制台/${SUBTITLE}/g /usr/share/nginx/html/setting.js

nginx -g "daemon off;"