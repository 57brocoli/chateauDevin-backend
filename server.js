const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

////////////////////////////////////////////////Configuration d' express////////////////////////////////////////////////////////
const app = express();
const port = 5000;

app.use(cors()); // Pour autoriser toutes les origines
app.use(bodyParser.json()); // Analyse les données JSON envoyées dans le corps des requêtes.
app.use(bodyParser.urlencoded({ extended: true })); // Analyse les données de formulaire URL-encodées.

////////////////////////////////////Définition des routes pour les utilisateurs ///////////////////////////
app.use("/user", require("./controllers/user.controller"));

////////////////////////////////////Définition des routes pour le vin ///////////////////////////
app.use("/wine",require("./controllers/wine.controller"));

///////////////////////////////////////////////////Démarrage du serveur///////////////////////////////////////////////////////
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});