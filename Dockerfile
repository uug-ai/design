FROM node:20-bookworm-slim AS builder

ARG project
ARG github_username
ARG github_token

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build
RUN npm run build-storybook

FROM nginx:alpine@sha256:a3554c0d0b48177b1413c26e01f695334428020d9df01243fbae3e11cfd17417 AS runtime

RUN apk upgrade --no-cache && \
    apk add --no-cache 'curl>=8.23.0-r0' 'libcurl>=8.23.0-r0'

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]