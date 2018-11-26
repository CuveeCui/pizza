FROM registry.cn-beijing.aliyuncs.com/xiguacity/root-front:latest

ARG PROJECT_NAME

ARG NODE_ENV

ENV PROJECT_PATH=/var/www/$PROJECT_NAME/

COPY ./package.json ${PROJECT_PATH}

WORKDIR ${PROJECT_PATH}

RUN yarn config set sass-binary-site http://npm.taobao.org/mirrors/node-sass

RUN yarn config set sentrycli_cdnurl https://npm.taobao.org/mirrors/sentry-cli

RUN yarn install --registry=https://registry.npm.taobao.org

COPY . ${PROJECT_PATH}

RUN yarn build $NODE_ENV

