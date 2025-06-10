FROM node:18

WORKDIR /app

# Copie du fichier package.json
COPY ./src/package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste du code source
COPY ./src ./src

WORKDIR /app/src

CMD ["sh", "-c", "node seed.js && node main.js"]