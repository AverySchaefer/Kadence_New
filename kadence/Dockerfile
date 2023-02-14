# syntax=docker/dockerfile:1
FROM node:18-alpine
COPY . .
RUN npm ci 
CMD ["npm", "start"]
EXPOSE 3000
