FROM nginx:1.15-alpine

ADD ./build /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

EXPOSE 80

ADD ./run.sh /run.sh

RUN chmod +x /run.sh
CMD ["/run.sh"]

