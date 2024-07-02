FROM node:20.15.0-alpine as development


WORKDIR /home/node

COPY package*.json ./
RUN npm install
COPY . .


EXPOSE 3000
USER node
CMD ["npm", "run", "dev"]
ENTRYPOINT [ "sh", "-c" ]

# Production stage
FROM node:20.15.0-alpine as production

WORKDIR /home/node

COPY package*.json ./
RUN npm install --only=production
COPY . .

EXPOSE 3000
USER node
CMD ["node", "index.js"]