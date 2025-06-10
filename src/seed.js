const sequelize = require('./db');
const Produit  = require('./models/produit');
const Magasin  = require('./models/magasin');
const Vente    = require('./models/vente');
const StockCentral = require('./models/stockCentral');

async function seed() {
  try {
    console.log('Réinitialisation de la base...');
    await sequelize.sync({ force: true });
    console.log("Structure des tables synchronisée (force:true)");

    const magasinsData = [
      { nom: 'Alger' },
      { nom: 'Oran' },
      { nom: 'Bejaia'},
      { nom: 'Blida'},
      { nom: 'Chlef'}
    ];
    const magasins = await Magasin.bulkCreate(magasinsData, { returning: true });
    console.log(`Magasins créés : ${magasins.map(m => m.nom).join(', ')}`);

    const produitsData = [
      { nom: 'Pain',           categorie: 'Alimentation', prix: 2.5, quantite: 100 },
      { nom: 'Lait',           categorie: 'Alimentation', prix: 1.9, quantite: 80 },
      { nom: 'Savon',          categorie: 'Hygiène',      prix: 3.2, quantite: 60 },
      { nom: 'Brosse à dents', categorie: 'Hygiène',      prix: 2.8, quantite: 40 },
      { nom: 'Eau (bouteille)',categorie: 'Boissons',     prix: 1.0, quantite: 200 }
    ];
    const produits = await Produit.bulkCreate(produitsData, { returning: true });
    console.log(`Produits créés : ${produits.map(p => p.nom).join(', ')}`);
    
    const STOCK_CENTRAL_QUANTITE = 350;
    const inventaire = {};
    produits.forEach(p => {
      inventaire[p.id] = STOCK_CENTRAL_QUANTITE;
    });

    await StockCentral.create({ inventaire });
    console.log(`Stock central singleton initialisé avec ${Object.keys(inventaire).length} produits`);

    const ventesData = [];
    magasins.forEach(magasin => {
      produits.forEach(produit => {
        const quantiteVendu = Math.floor(Math.random() * 16) + 5;
        ventesData.push({
          quantite: quantiteVendu,
          ProduitId: produit.id,
          MagasinId: magasin.id
        });
      });
    });
    await Vente.bulkCreate(ventesData);
    console.log(`Ventes créées : ${ventesData.length} enregistrements`);

    console.log('Seed terminé avec succès !');
  } catch (error) {
    console.error('Erreur lors du seed :', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

seed();