FROM mhart/alpine-node:8.11.4

# Create app directory
WORKDIR /usr/src/app

RUN apk update && \
    apk upgrade && \
    apk add git

# Install app dependencies
COPY package.json .
COPY yarn.lock .

RUN yarn install

# Bundle app source
COPY . .

EXPOSE 80
CMD [ "yarn", "start" ]
