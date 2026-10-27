# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim@sha256:de170b39439eb0e5a3444ad7d60b015614a381e10fecae2e30ec9e735122f38d AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json tsconfig.node.json vite.config.ts index.html ./
COPY .storybook/ ./.storybook/
COPY scripts/ ./scripts/
COPY public/ ./public/
COPY src/ ./src/
RUN mkdir .image-test && TMPDIR=/app/.image-test npm run test:favicons && npm run build:all && \
    node scripts/image-inventory.mjs && \
    node --test scripts/test-image.mjs && \
    find dist -type d -exec chmod 0555 {} + && \
    find dist -type f -exec chmod 0444 {} +

FROM golang:1.26.10-bookworm@sha256:632dff7351799a5a9954a48dc06670ade72ee44e8c351cdc0e5a57af2fea21af AS launcher
ENV GOTOOLCHAIN=local CGO_ENABLED=0
WORKDIR /src
COPY image/go.mod image/*.go ./
RUN go test ./... && go vet ./... && \
    go build -mod=readonly -trimpath -buildvcs=false -ldflags="-w -buildid=" -o /design . && \
    go run golang.org/x/vuln/cmd/govulncheck@v1.9.0 ./... && \
    go run golang.org/x/vuln/cmd/govulncheck@v1.9.0 -mode=binary /design

FROM launcher AS test
COPY --from=builder /app/dist /dist
RUN go test ./... && test -s /dist/index.html && \
    test -s /dist/storybook/index.html && \
    test -s /dist/storybook/iframe.html && test -s /dist/storybook/index.json

FROM cgr.dev/chainguard/nginx:latest@sha256:9aa6c46648f17b2835d009fd4338b38591b2396670a07270ee19b532f83dbbb5
ARG VERSION=dev
ARG REVISION=unknown
ARG CREATED
LABEL org.opencontainers.image.title="design" \
      org.opencontainers.image.source="https://github.com/uug-ai/design" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${REVISION}" \
      org.opencontainers.image.created="${CREATED}" \
      org.opencontainers.image.vendor="UUG.AI"
COPY --from=launcher --chown=0:0 --chmod=0555 /design /app/main
COPY --chown=0:0 --chmod=0444 nginx.conf /etc/nginx/nginx.conf
COPY --from=builder --chown=0:0 /app/dist /usr/share/nginx/html
COPY --from=builder --chown=0:0 --chmod=0444 /app/image-inventory/ /usr/share/frontend/
USER 65532:65532
WORKDIR /usr/share/nginx/html
EXPOSE 8080/tcp
ENTRYPOINT ["/app/main"]
CMD []
