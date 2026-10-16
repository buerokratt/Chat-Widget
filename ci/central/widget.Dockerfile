FROM node:22.18.0-bookworm-slim@sha256:752ea8a2f758c34002a0461bd9f1cee4f9a3c36d48494586f60ffce1fc708e0e AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts --no-audit --no-fund
FROM dependencies AS test
COPY . .
RUN --network=none CI=true npm test -- --watchAll=false --runInBand --setupFiles /app/public/env-config.js && ./node_modules/.bin/tsc --noEmit
FROM dependencies AS build
COPY . .
RUN NODE_OPTIONS=--max-old-space-size=1536 npm run webpack
FROM nginx:1.25.4-alpine@sha256:a8b39bd9cf0f83869a2162827a0caf6137ddf759d50a171451b335cecc87d236 AS runtime
COPY --from=build /app/dist/ /usr/share/nginx/html/widget/
COPY ci/central/widget.html /usr/share/nginx/html/widget/index.html
COPY ci/central/widget-env.js /usr/share/nginx/html/widget/env-config.js
COPY ci/central/static.conf /etc/nginx/conf.d/default.conf
