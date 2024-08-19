const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt')

const dbPath = path.join(__dirname, './../database/user.json');

class UserModel {
    constructor() {
        this.dbPath = dbPath;
    }

    // Méthode pour lire les données
    readDb() {
        if (!fs.existsSync(this.dbPath)) {
            fs.writeFileSync(this.dbPath, JSON.stringify({ users: [] }, null, 2));
        }
        const data = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(data);
    }

    // Méthode pour écrire les données
    writeDb(data) {
        fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
    }

    // Méthode pour ajouter un utilisateur
    async addUser(user) {
        const db = this.readDb();
        user.id = new Date().getTime(); // Génère un ID unique
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
        db.users.push(user);
        this.writeDb(db);
        return user;
    }

    // Méthode pour trouver un utilisateur par email
    findUserByEmail(email) {
        const db = this.readDb();
        return db.users.find(user => user.email === email);
    }

    // Méthode pour obtenir tous les utilisateurs
    getAllUsers() {
        const db = this.readDb();
        return db.users;
    }
}

module.exports = UserModel;