FROM node
WORKDIR /app
VOLUME ["/app"]
COPY package.json .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "start"]