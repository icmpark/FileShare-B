FROM alpine
RUN apk update
RUN apk add --no-cache nodejs yarn 
RUN apk add --no-cache curl
RUN apk add --no-cache build-base vips-dev

COPY package.json /usr/src/app/package.json
WORKDIR /usr/src/app
RUN yarn global add node-gyp
RUN yarn install
RUN mkdir uploadPath
COPY . /usr/src/app
ENTRYPOINT [ "yarn", "start"]