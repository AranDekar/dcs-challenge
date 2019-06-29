# yarn runs into problems with the node engine version specified in package-lock.json
FROM mhart/alpine-node:8.12.0

RUN apk update && \
    apk upgrade && \
    apk add git

# Create app directory
RUN mkdir -p /srv/tcog
WORKDIR /srv/tcog

# Install app dependencies
COPY package.json /srv/tcog
COPY yarn.lock /srv/tcog
RUN yarn install

# Bundle app source
COPY . /srv/tcog

EXPOSE 3000
CMD [ "yarn", "start" ]
