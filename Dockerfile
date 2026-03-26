FROM node:20-bookworm-slim AS builder

ARG project
ARG github_username
ARG github_token

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html/design

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]