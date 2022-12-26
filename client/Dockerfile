
# base image
FROM node:18-alpine AS builder

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
# ENV PATH ./node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json ./

RUN npm install

COPY ./ ./

RUN chmod -R 777 ./node_modules/

# start app
CMD ["npm", "run", "build"]

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
