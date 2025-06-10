const Produit       = require('../models/produit');
const Magasin       = require('../models/magasin');
const Vente         = require('../models/vente');

exports.afficherProduits = async (req, res) => {
  const magasinId = req.params.id;
  const produits  = await Produit.findAll({
    include: {
      model: Magasin,
      where: { id: magasinId },
      through: { attributes: [] }
    }
  });
  res.json(produits);
};

exports.rechercherProduit = async (req, res) => {
  const magasinId = req.params.id;
  const { nom, categorie } = req.query;
  const where = {};
  if (nom) where.nom = nom;
  if (categorie) where.categorie = categorie;
  const produits = await Produit.findAll({
    where,
    include: {
      model: Magasin,
      where: { id: magasinId }
    }
  });
  res.json(produits);
};

exports.enregistrerVente = async (req, res) => {
  const magasinId = req.params.id;
  const { produitId, quantite } = req.body;
  const produit = await Produit.findByPk(produitId);
  if (!produit || quantite > produit.quantite) {
    return res.status(400).json({ error: 'Quantité invalide ou stock insuffisant' });
  }
  
  produit.quantite -= quantite;
  await produit.save();
  
  await Vente.create({ quantite, ProduitId: produitId, MagasinId: magasinId });
  res.json({ message: 'Vente enregistrée', nouveauStock: produit.quantite });
};

exports.faireRetour = async (req, res) => {
  //const magasinId = req.params.id;
  const { produitId, quantite } = req.body;
  const produit = await Produit.findByPk(produitId);
  if (!produit) {
    return res.status(400).json({ error: 'Produit introuvable' });
  }
  produit.quantite += quantite;
  await produit.save();
  res.json({ message: 'Retour enregistré', nouveauStock: produit.quantite });
};

exports.recupererMagasin = async (_req, res) => {
  try {
    const liste = await Magasin.findAll();
    res.json(liste);
  } catch (err) {
    console.error('Erreur GET /api/magasins', err);
    res.status(500).json({ error: err.message });
  }
};