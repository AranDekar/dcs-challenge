# Currently run into build problems when attempting to switch to yarn for builds
FROM mhart/alpine-node:8.12.0

RUN apk add --no-cache git

ENV APP_HOME /app

RUN mkdir $APP_HOME
WORKDIR $APP_HOME
COPY . $APP_HOME
RUN yarn install
RUN yarn run build

EXPOSE 3000
CMD [ "yarn", "start" ]
