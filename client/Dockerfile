# Stage 1: Development
FROM node:20.15.0-alpine as development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Stage 2: Build
FROM node:20.15.0-alpine as build
WORKDIR /app
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package*.json ./
COPY . .
RUN npm run build

# Stage 3: Production
FROM nginx:1.27.0-alpine as production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
