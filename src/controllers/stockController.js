const StockCentral  = require('../models/stockCentral');
const Produit      = require('../models/produit');

exports.afficherStock = async (_req, res) => {
  try {
    const stock = await StockCentral.findOne();
    if (!stock) return res.status(404).json({ error: 'Stock central introuvable' });

    const produits = await Produit.findAll();
    const inventaire = stock.inventaire;

    const stockListe = produits.map(p => ({
      id      : p.id,
      nom     : p.nom,
      quantite: inventaire[p.id] || 0
    }));

    res.json(stockListe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.retirerDuStock = async (req, res) => {
  try {
    const { produitId, quantiteDemandee } = req.body;
    const stock = await StockCentral.findOne();
    const inventaire = stock.inventaire;
    const dispo = inv[produitId] || 0;

    if (quantiteDemandee > dispo) {
      return res.status(400).json({
        error: `Stock insuffisant : demandé ${quantiteDemandee}, disponible ${dispo}`
      });
    }

    inventaire[produitId] = dispo - quantiteDemandee;

    stock.inventaire = inventaire;
    await stock.save();

    //const updated = await StockCentral.findOne();

    res.json({
      message: `Réapprovisionnement de ${quantiteDemandee} unités OK`,
      nouvelleQuantite: stock.inventaire[produitId],
      inventaire: stock.inventaire
    });
    } catch (err) {
      console.error('Erreur reapprovisionnement:', err);
      res.status(500).json({ error: err.message });
    }
};