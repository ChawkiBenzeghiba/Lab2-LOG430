# Lab2-LOG430 – Système Multi-Magasins

## 1. Brève description de l'application

Ce projet est un prototype de gestion centralisée pour plusieurs magasins.  
Il offre :  
- la génération d’un rapport consolidé des ventes (UC1),  
- la consultation du stock central et le réapprovisionnement d’un magasin (UC2),  
- la visualisation des performances des magasins dans un tableau de bord (UC3).  

L’API est développée en **Node.js/Express**, persiste les données avec **Sequelize** et **PostgreSQL**, et s’exécute en **conteneurs Docker**.

---

## 2. Instructions d’exécution

### 2.1 Cloner le dépôt  
```bash
git clone https://github.com/ChawkiBenzeghiba/Lab2-LOG430.git
cd Lab2-LOG430
```

### 2.2 Lancer les services  
```bash
docker-compose up --build
```

### 2.3 Instructions pour l’API  
Une fois les conteneurs démarrés :  
- Rapport consolidé : `GET http://localhost:3000/api/rapport`  
- Stock central : `GET http://localhost:3000/api/stock-central`  
- Réapprovisionnement : `POST http://localhost:3000/api/:magasinId/reapprovisionnement`    
- Tableau de bord : `GET http://localhost:3000/api/tableau-bord`

---

## 3. Structure du projet
```plaintext
.
├── .github/workflows/ci.yml        # Pipeline CI/CD GitHub Actions
├── docs/                           # Documentation ADR et UML
|   ├── UML/                        # Les UML des 4 vues + 1 (contient 7 fichiers UML)
|   └── ADR/                        # Architecture Decision Records (contient les 3 ADRs)
├── frontend/
|   └── src/                        
|       ├── components/             # Les différentes Vues qui permettent d'afficher le code sur le web
|       └── router/                 # dossier de routes
|           └── index.js            # Contient les routes des différentes Vues
├── src/
│   ├── controllers/                # Logique métier (UC1, UC2, UC3)
│   ├── models/                     # Définition Sequelize
│   ├── routes/                     # Déclarations des routes Express
│   ├── tests/                      # Tests unitaires & d’intégration (Jest)
│   ├── db.js                       # Connexion Sequelize
│   ├── sync.js                     # Synchronisation des modèles
│   └── app.js                      # Configuration et lancement Express
├── gitignore                                           
├── docker-compose.yml              # Orchestration services : app + postgres
├── Dockerfile                      # Image de l'application Node.js
├── package.json                    # Dépendances et scripts
└── README.md                       # Documentation du laboratoire
```

## 4. Choix techniques

- **Langage** : JavaScript (Node.js)  
- **Framework** : Express  
- **ORM** : Sequelize  
- **Base de données** : PostgreSQL  
- **Conteneurisation** : Docker & Docker-Compose  
- **Tests** : Jest  
- **API** : RESTful (préfixe `/api`)  

---

## 5. Tests

Il est possible de vérifier le fonctionnement des tests des 3 UC implémentés avec leurs commandes respectives ou en faisant
```bash
npx jest
```

## 6. Pipeline CI/CD

Le fichier `.github/workflows/ci.yml` exécute automatiquement les tests à chaque push ou pull request, garantissant la validité des routes et de la persistance.

```