FROM node/10.0-alpine

ENV NODE_ENV production

# docker build -t moviesAPI .

# docker-compose up
# docker-compose -f test.docker-compose.yml up

# https://github.com/gliderlabs/docker-alpine/blob/master/docs/usage.md
# https://www.cyberciti.biz/faq/10-alpine-linux-apk-command-examples/

# Update & install required packages
RUN apk add --update bash git yarn make python g++

# Install app dependencies
COPY package.json /api/package.json
RUN cd /api; yarn install

# Copy app source
COPY . /api

# Set work directory to /api
WORKDIR /api

# set your port
ENV PORT 8080

# expose the port to outside world
EXPOSE  8080

# RUN apk del python make g++
RUN yarn build

# start command as per package.json
CMD ["yarn", "start"]