const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const dbPath = path.join(__dirname, './../database/wine.json')

class WineMethodes {
    constructor(){
        this.dbPath = dbPath
    }

    // Méthode pour lire les données
    readDb() {
        if (!fs.existsSync(this.dbPath)) {
            fs.writeFileSync(this.dbPath, JSON.stringify({ wines: [] }, null, 4));
        }
        const data = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(data);
    }

    // Méthode pour écrire les données
    writeDb(data) {
        fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
    }

    // Méthode pour ajouter un vin
    async addWine(wine) {
        const db = this.readDb();
        wine.id = new Date().getTime(); // Génère un ID unique
        // Génération du QR code pour le vin
        const winePageUrl = wine.url;
        const qrCodeImage = await QRCode.toDataURL(winePageUrl);
        // Ajout du QR code à l'objet vin
        wine.qrCode = qrCodeImage;
        db.wines.push(wine);
        this.writeDb(db);
        return wine;
    }

    // Méthode pour trouver un vin par name
    findWineById(id) {
        const db = this.readDb();
        return db.wines.find(wine => wine.id === id);
    }

    // Méthode pour obtenir tous les vins
    getAllWines() {
        const db = this.readDb();
        return db.wines;
    }
}

module.exports = WineMethodes