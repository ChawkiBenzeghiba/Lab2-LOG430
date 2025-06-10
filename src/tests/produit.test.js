const sequelize = require('../db');
const Produit = require('../models/produit');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // reset la table
  await Produit.create({ nom: 'Test', categorie: 'TestCat', prix: 10, quantite: 50 });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Modèle Produit', () => {

  test('Créer un produit', async () => {
    const produit = await Produit.create({
      nom: 'TestProduit',
      categorie: 'TestCatégorie',
      prix: 10.5,
      quantite: 20
    });

    expect(produit).toBeDefined();
    expect(produit.nom).toBe('TestProduit');
    expect(produit.prix).toBe(10.5);
    expect(produit.quantite).toBe(20);
  });

  test('Retrouver un produit par ID', async () => {
    const produit = await Produit.create({
      nom: 'ProduitID',
      categorie: 'CatID',
      prix: 8,
      quantite: 15
    });

    const recupere = await Produit.findByPk(produit.id);
    expect(recupere.nom).toBe('ProduitID');
  });

  test('Lister tous les produits', async () => {
    await Produit.create({
      nom: 'ProduitA',
      categorie: 'Test',
      prix: 5,
      quantite: 10
    });

    const produits = await Produit.findAll();
    expect(produits.length).toBeGreaterThan(0);
  });

  test('Mettre à jour la quantité', async () => {
    const produit = await Produit.create({
      nom: 'ProduitMaj',
      categorie: 'TestMaj',
      prix: 3.5,
      quantite: 50
    });

    produit.quantite -= 5;
    await produit.save();

    const maj = await Produit.findByPk(produit.id);
    expect(maj.quantite).toBe(45);
  });

});
