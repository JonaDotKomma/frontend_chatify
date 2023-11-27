# container app "demoreact" - Development v.0.1.0
# by <your name> | <date># pull official base image
FROM node:alpine

# set working directory
WORKDIR "/app"


# install app dependencies
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install --legacy-peer-deps

# add app
COPY . ./

# start app
CMD ["npm", "start"]
