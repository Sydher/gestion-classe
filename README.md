# Gestion Classe

Application web de gestion de classe pour un professeur : création de classes personnalisables (nom, couleurs, logo), gestion des élèves, suivi des observations et des communications avec les familles.

## Fonctionnalités

- **Classes** : création avec nom, couleur principale/secondaire et logo ; ces couleurs sont réutilisées dynamiquement dans toute l'interface de la classe (thème personnalisé par classe)
- **Élèves** : nom, prénom, date de naissance, latéralité (gaucher/droitier)
- **Observations** : notes datées et libres sur un élève
- **Communications avec la famille** : historique daté (téléphone, email, rencontre, mot dans le carnet, autre) avec résumé de l'échange
- Chaque professeur (compte) ne voit que ses propres classes et élèves

## Stack technique

- [Laravel 12](https://laravel.com) (PHP) + [Inertia.js](https://inertiajs.com) + [React](https://react.dev) / TypeScript
- [Tailwind CSS](https://tailwindcss.com) pour le style, thème dynamique par variables CSS
- SQLite comme base de données
- Authentification via [Laravel Breeze](https://laravel.com/docs/starter-kits#breeze-and-inertia)

## Prérequis

- PHP 8.3+
- Composer
- Node.js 20+ et npm

## Lancer le projet en local

1. Installer les dépendances PHP et JavaScript :

   ```bash
   composer install
   npm install
   ```

2. Créer le fichier d'environnement et générer la clé d'application :

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. Créer la base de données SQLite et lancer les migrations :

   ```bash
   touch database/database.sqlite
   php artisan migrate
   ```

4. Lier le stockage public (nécessaire pour l'affichage des logos de classe) :

   ```bash
   php artisan storage:link
   ```

5. Lancer les serveurs de développement (dans deux terminaux séparés, ou via `concurrently`) :

   ```bash
   php artisan serve
   npm run dev
   ```

6. Ouvrir [http://127.0.0.1:8000](http://127.0.0.1:8000) et créer un compte professeur.

### Lancer les tests

```bash
php artisan test
```

### Build de production des assets

```bash
npm run build
```
