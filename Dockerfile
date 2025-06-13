FROM node:18

# 1) Travailler à la racine /app
WORKDIR /app

# 2) Copier le package.json (et package-lock.json s’il existe)
COPY package*.json ./

# 3) Installer les dépendances express, cors, etc.
RUN npm install

# 4) Copier tout le code (src + autres fichiers) dans l’image
COPY . .

# 5) Pointer sur le dossier src pour lancer l’app
WORKDIR /app/src

# 6) Démarrer votre seed puis le serveur
CMD ["sh", "-c", "node seed.js && node app.js"]