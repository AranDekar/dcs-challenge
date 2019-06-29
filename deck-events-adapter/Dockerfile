FROM mhart/alpine-node:8.12.0

RUN apk update && \
    apk upgrade && \
    apk add git

ENV APP_HOME /app

RUN mkdir $APP_HOME
WORKDIR $APP_HOME
COPY . $APP_HOME
RUN yarn install
RUN yarn run build

CMD [ "yarn", "start" ]
