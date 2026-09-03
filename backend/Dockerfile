FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . .

# data.json (lowdb) precisa sobreviver a reinícios do container — monte um
# volume neste caminho no docker-compose / na sua plataforma de hospedagem.
VOLUME ["/app/data"]
ENV DATA_DIR=/app/data

EXPOSE 3333

CMD ["node", "server.js"]
