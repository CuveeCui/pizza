FROM registry.cn-beijing.aliyuncs.com/xiguacity/root-front:latest

ENV PROJECT_PATH=/var/www/front/

COPY . ${PROJECT_PATH}

WORKDIR ${PROJECT_PATH}

RUN yarn install --registry=https://registry.npm.taobao.org/

RUN yarn build
#FROM nginx
#
#RUN apt-get update
#
#RUN echo "Y" | apt-get install curl
#
#RUN echo "Y" | apt-get install gnupg
#
#RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
#
#RUN apt-get install -y nodejs && npm install yarn -g
#
#RUN /etc/init.d/nginx start

