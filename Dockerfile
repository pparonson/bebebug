# base image
FROM node:14-alpine

# set working directory
WORKDIR /usr/app

# add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH
ENV PATH ./node_modules/.bin:$PATH

# install and cache app dependencies
# COPY package.json /usr/app/package.json
COPY package.json ./

RUN npm install
# RUN npm install @vue/cli@3.7.0 -g
RUN npm install @vue/cli

COPY ./ ./

# start app
CMD ["npm", "run", "serve"]
