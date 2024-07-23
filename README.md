# 4IW1PROJET21

## Présentation

Composition du groupe:

- Arthur BOUAKI (jabsraighs)
- Lucas AGUESSE (LucasGitB)
- Antonin CAVANNE (37anton)
- Moustapha CHEGDALI (mchegdali)

## Mise en place

- Installer Node.js. Il est conseillé d'utiliser [nvm](https://github.com/nvm-sh/nvm).
- Installer [MongoDB Compass](https://www.mongodb.com/try/download/compass) pour explorer la base de données MongoDB.
- Installer [DBeaver](https://dbeaver.io/download/) pour administrer la base de données SQL.

- Dans le dossier `client`:
  - Créer le fichier `.env` à partir du `.env.exemple`
  - Installer les packages avec la commande `npm i`
  - Lancer le projet avec `npm run dev`.
- Dans le dossier `server`:
  - Suivre les instructions dans le fichier `README.md`.

## Répartitions des tâches

- Moustapha CHEGDALI:

  - Produits et stocks
  - Notifications
  - Utilisateurs
  - Authentification
  - Sécurisation
  - Maquettes
  - Page compte utilisateur
  - Composable useForm
  - Panier
  - Aide sur les autres features

- Arthur BOUAKI:

  - Paiements (avec Stripe)
  - Livraison (Affichage dans commandes)
  - Commandes (CRUD)

- Lucas AGUESSE:

  - Mise en place du CRUD Address
  - controller address
  - Seeder Address
  - Seeder order
  - page de connexion / inscription
  - page de liste de commande
  - page d'une commande
  - page du panier
  - page de suivi de livraison
  - api livraison
  - scheduler d'automatisation du suivi
  - PDF de facture de commande
  - page account
  - page address
  - composant modal pour delete
  - début du composable formulaire
  - filtrer les commandes
  - Les pages liées au RGPD
  - Correction sur CRUD Commande

- Antonin CAVANNE :
  - Mise en place d'un dashboard coté admin (utilisation de apexchart) dans /admin
  - Mise en place de graphes permettant de ressortir des stats via des composants
  - Mise en place d'une interface pour un role spécial (accountant) et accès à des stats liées à la vente
  - Mise en place des requetes en back permettant d'alimenter les charts
  - Composant Tableau utilisé pour gérer les utilisateurs du site : trier des colonnes, exporter en csv, edit de users, avec systeme de pagination, et de recherches dans le tableau, cases à cocher
  - Gestion des catégories et des produits via un CRUD dans admin/categories/gestion et admin/produits/gestion
  - Upload de fichiers images (Multer)
  - affichage des commandes dans un tableau paginé dans admin/Commandes
  - utilisation de notifications
