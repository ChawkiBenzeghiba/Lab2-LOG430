const Produit = require('../models/produit');
const Magasin = require('../models/magasin');
const Vente   = require('../models/vente');

exports.genererRapportJson = async (req, res) => {
  try {
    const produits = await Produit.findAll();

    const ventes = await Vente.findAll({ include: [Produit, Magasin] });

    const ventesParMagasin = {};
    ventes.forEach(v => {
      const m = v.Magasin.nom;
      const p = v.Produit.nom;
      const montant = v.quantite * v.Produit.prix;
      ventesParMagasin[m] = ventesParMagasin[m] || {};
      ventesParMagasin[m][p] = (ventesParMagasin[m][p] || 0) + montant;
    });

    const quantiteVendue = {};
    ventes.forEach(v => {
      const p = v.Produit.nom;
      quantiteVendue[p] = (quantiteVendue[p] || 0) + v.quantite;
    });

    const stocksRestants = {};
    produits.forEach(p => {
      const vendu = quantiteVendue[p.nom] || 0;
      stocksRestants[p.nom] = p.quantite - vendu;
    });

    const topVentes = Object.entries(quantiteVendue)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([nom, qte]) => ({ produit: nom, quantiteVendue: qte }));

    res.json({
      ventesParMagasin,
      topVentes,
      stocksRestants
    });
  } catch (err) {
    console.error('Erreur dans générerRapportJson:', err);
    res.status(500).json({ error: err.message });
  }
};