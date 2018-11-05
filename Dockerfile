FROM nginx

ENV PROJECY_PATH=/usr/local/front/

VOLUME ./nginx.conf:/etc/nginx/nginx.conf

COPY .  ${PROJECY_PATH}

WORKDIR ${PROJECY_PATH}

