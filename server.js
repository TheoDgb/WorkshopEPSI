const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Route pour servir le fichier HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});