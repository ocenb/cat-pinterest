FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm run build

USER node

FROM node:22-alpine AS production

WORKDIR /app

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/openapi.yaml /app/openapi.yaml

CMD ["node", "dist/main.js" ]