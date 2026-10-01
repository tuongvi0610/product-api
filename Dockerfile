FROM node:18-alpine

WORKDIR /usr/src/app

# Cài đặt curl để phục vụ docker healthcheck ở bước sau
RUN apk add --no-cache curl

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]