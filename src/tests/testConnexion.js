import sequelize from '../db.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à PostgreSQL réussie via Sequelize.');
    await sequelize.close();
  } catch (error) {
    console.error('Échec de la connexion à la base de données :', error.message);
  }
})();
