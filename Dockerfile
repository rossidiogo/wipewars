# Builds the single-file game and serves it with nginx.
#   docker build -t wipewars .
#   docker run --rm -p 8734:80 wipewars     -> http://localhost:8734
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
