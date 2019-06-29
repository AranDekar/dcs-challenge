FROM mhart/alpine-node:8.11.4

# Create app directory
RUN mkdir -p /srv/tests
WORKDIR /srv/tests

# Install app dependencies
COPY . /srv/tests

RUN yarn install
RUN yarn global add mocha
RUN yarn global add typescript
RUN yarn global add ts-node
