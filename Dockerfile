FROM node:16

WORKDIR /app

COPY ./package.json ./

RUN yarn

COPY . .

#ENV PORT=5050
#ENV JWT_SECRET=PHIPHUOC
#ENV MONGO_URI=mongodb+srv://congphi:1@authen-app.snsagpn.mongodb.net/dashboard-monitoring-database

EXPOSE ${PORT}

CMD ["node", "index.js"]
