const readline = require('readline');
const sequelize = require('./db');
const Produit = require('./models/produit');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function afficherProduits() {
    const produits = await Produit.findAll({
    order: [['id', 'ASC']]
    });
    console.log('\nProduits disponibles :');
    produits.forEach(p => {
    console.log(`- ${p.nom} | Catégorie : ${p.categorie} | Prix : ${p.prix}$ | Stock : ${p.quantite}`);
    });
    console.log();
}

async function rechercherProduit() {
    rl.question('\nRechercher par (1) Nom ou (2) Catégorie ? ', (choix) => {
    if (choix === '1') {
        rl.question('Entrez le nom du produit : ', async (nom) => {
        const produits = await Produit.findAll({ where: { nom } });
        if (produits.length === 0) {
            console.log('Aucun produit trouvé avec ce nom.');
        } else {
            produits.forEach(p => {
            console.log(`- ${p.nom} | ${p.categorie} | ${p.prix}$ | Stock : ${p.quantite}`);
            });
        }
        afficherMenu();
        });
    } else if (choix === '2') {
        rl.question('Entrez la catégorie du produit : ', async (categorie) => {
        const produits = await Produit.findAll({ where: { categorie } });
        if (produits.length === 0) {
            console.log('Aucun produit trouvé dans cette catégorie.');
        } else {
            produits.forEach(p => {
            console.log(`- ${p.nom} | ${p.categorie} | ${p.prix}$ | Stock : ${p.quantite}`);
            });
        }
        afficherMenu();
        });
    } else {
        console.log('Choix invalide.');
        afficherMenu();
    }
    });
}

async function enregistrerVente() {
    rl.question('\nEntrez l\'ID du produit à vendre : ', async (id) => {
        const produit = await Produit.findByPk(id);
        if (!produit) {
            console.log('Produit introuvable.');
            afficherMenu();
            return;
        }

        rl.question(`Quantité à vendre pour "${produit.nom}" (stock actuel : ${produit.quantite}) : `, async (quantiteStr) => {
            const quantite = parseInt(quantiteStr);
            if (isNaN(quantite) || quantite <= 0) {
            console.log('Quantité invalide.');
            afficherMenu();
            return;
            }

            if (quantite > produit.quantite) {
            console.log('Stock insuffisant.');
            afficherMenu();
            return;
            }

            produit.quantite -= quantite;
            await produit.save();

            const total = quantite * produit.prix;
            console.log(`Vente enregistrée. Total : ${total}$`);

            afficherMenu();
        });
    });
}

async function faireRetour() {
    rl.question('\nEntrez l\'ID du produit à retourner : ', async (id) => {
        const produit = await Produit.findByPk(id);
        if (!produit) {
            console.log('Produit introuvable.');
            afficherMenu();
            return;
        }

        rl.question(`Quantité à retourner pour "${produit.nom}" : `, async (quantiteStr) => {
            const quantite = parseInt(quantiteStr);
            if (isNaN(quantite) || quantite <= 0) {
                console.log('Quantité invalide.');
                afficherMenu();
                return;
            }

            produit.quantite += quantite;
            await produit.save();

            console.log(`Retour enregistré. Nouveau stock de "${produit.nom}" : ${produit.quantite}`);
            afficherMenu();
        });
    });
}



function afficherMenu() {
    console.log('=============================');
    console.log('       SYSTÈME DE CAISSE     ');
    console.log('=============================');
    console.log('1. Afficher tous les produits');
    console.log('2. Rechercher un produit');
    console.log('3. Enregistrer une vente');
    console.log('4. Faire un retour');
    console.log('5. Quitter');
    rl.question('\nChoisissez une option : ', async (choix) => {
        switch (choix) {
        case '1':
            await afficherProduits();
            afficherMenu();
            break;
        case '2':
            await rechercherProduit();
            break;
        case '3':
            await enregistrerVente();
            break;
        case '4':
            await faireRetour();
            break;
        case '5':
            console.log('À bientôt !');
            await sequelize.close();
            rl.close();
            break;
        default:
            console.log("Option non reconnue.");
            afficherMenu();
        }
    });
}

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion établie à la base.');
        afficherMenu();
    } catch (error) {
        console.error('Erreur de connexion :', error.message);
        rl.close();
    }
})();

