# syntax=docker/dockerfile:1
FROM node:18-alpine
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

COPY . .
RUN npm run build
ENV NODE_ENV=production

CMD ["npm", "start"]
EXPOSE 80
