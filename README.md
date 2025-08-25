# MoneyWise - Frontend

Ce projet contient le code source du frontend pour MoneyWise, une application web open-source conçue pour simplifier la gestion de vos finances personnelles. Elle permet aux utilisateurs de suivre facilement leurs revenus et leurs dépenses, de les organiser par catégories personnalisables et d'obtenir une vision claire de leur situation financière grâce à des graphiques intuitifs.

## Stack Technique

*   **React.js** - Une bibliothèque JavaScript pour construire des interfaces utilisateur.
*   **Vite** - Un outil de build frontend moderne et rapide.
*   **TypeScript** - Un surensemble de JavaScript qui ajoute un typage statique.
*   **Tailwind CSS** - Un framework CSS "utility-first" pour un design rapide et personnalisé.
*   **Recharts** - Une bibliothèque de graphiques pour React.
*   **React Router** - Pour la gestion des routes côté client.#

## Démarrage Rapide

Suivez ces instructions pour obtenir une copie du projet et la faire fonctionner sur votre machine locale à des fins de développement.

### Prérequis

Assurez-vous d'avoir [Node.js](https://nodejs.org/) (version 18 ou supérieure) installé sur votre machine.

### Installation

1.  Clonez le dépôt (si ce n'est pas déjà fait) :
    ```sh
    git clone <URL_DU_DEPOT>
    ```
2.  Naviguez jusqu'au répertoire du frontend :
    ```sh
    cd MoneyWise-Project/frontend
    ```
3.  Installez les dépendances NPM :
    ```sh
    npm install
    ```

### Lancer le serveur de développement#

Pour lancer l'application en mode développement, exécutez la commande suivante. L'application se lancera sur `http://localhost:5173`.

```sh
npm run dev
```

## Scripts Disponibles

Dans le répertoire du projet, vous pouvez exécuter :

*   `npm run dev`: Lance l'application en mode développement.
*   `npm run build`: Compile l'application pour la production dans le dossier `dist`.
*   `npm run lint`: Lance ESLint pour analyser le code et trouver des problèmes.
*   `npm run preview`: Lance un serveur local pour prévisualiser le build de production.
