const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Route pour servir le fichier HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Les ressources statiques ( feuilles de style CSS etc...) seront toutes servies à partir du dossier "resources"
app.use(express.static('resources'));

app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port} : http://localhost:${port}`);
});