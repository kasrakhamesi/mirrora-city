FROM node:18


# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./

RUN yarn

# Copy app source code
COPY . .

# Build app
ENTRYPOINT [ "yarn", "run", "start" ]

EXPOSE 3077
