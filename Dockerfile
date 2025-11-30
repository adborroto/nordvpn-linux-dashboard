FROM node:20-alpine

# Install curl
RUN apk update && apk add --no-cache curl

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY src ./src
COPY public ./public

ENV PORT=8080
EXPOSE 8080

# Run as root so we can call nordvpn without sudo
USER root

CMD ["npm", "start"]
