# Workshop EPSI (7/10/2024 - 11/10/2024)

## Objectif
Imaginer un projet innovant et réaliser un prototype de développement informatique pour de la prévention sur le thème de la santé dans un groupe de 4 personnes

==> Concevoir un jeu visant à prévenir le stress
- Hardware
  - Capteur de pression artérielle
  - Carte Arduino programmé en langage C permettant de récupérer, convertir et d'envoyer à l'application web les données de la pression artérielle de l'utilisateur / joueur
- Application web
  - Backend : Node.js / Express.js
  - Graphique en temps réel de pression artérielle : Plotly
  - Jeu "bullet hell", lié aux valeurs de pression artérielle de l'utilisateur / joueur, ajoutant divers malus en fonction de son niveau de stress
  - IA : Reconnaissance des performances du joueur en fonction de sa pression artérielle. Si elle détecte que le joueur gère mieux son stress face aux malus, elle propose des défis plus complexes ou à l’inverse plus facile afin d’équilibrer le jeu à l’utilisateur.

### Installer les dépendances du projet
    npm install

### Lancer le serveur Express.js
    npm start server.js
    ==> http://localhost:3000/
