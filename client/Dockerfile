FROM node:20.13-slim as builder

WORKDIR /app
COPY ./package.json ./

RUN npm install
COPY . .
RUN npm run build

# CMD ["npm", "run", "preview"]


FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html