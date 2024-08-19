const express = require('express');
const router = express.Router()
const bcrypt = require('bcrypt');
const UserModel = require('../services/user.methodes');
const userModel = new UserModel();
const jwt = require('jsonwebtoken');
require('dotenv').config();
let response

//Controller pour enregistrer un utilisateur
router.post('/register', (req, res) => {
    try {
        const user = req.body;
        const existingUser = userModel.findUserByEmail(user.email);
        if (existingUser) {
            response = {
                status : false,
                message : "utilisateur deja existant"
            }
            return res.status(400).json(response)
        }
        const newUser = userModel.addUser(user)
        response = {
            status : true,
            data : newUser
        }
        res.status(201).json(response);
    } catch {
        response = {
            status : false,
            message : "Erreur interne du serveur"
        }
        return res.status(500).json(response)
    }
});

//Controller pour récupérer tous les utilisateurs
router.get("/alls", (req, res) => {
    const users = userModel.getAllUsers()
    res.json(users)
})

//Controller pour récupérer un utilisateur
router.post("/login", async (req, res) => { 
    try{
        const {email, password} = req.body
        if (!email && !password) {
            response = {
                status: false,
                message: "Email et mot de passe sont requis."
            }
            return res.status(400).json(response);
        }
        const user = userModel.findUserByEmail(email)   
        if (!user || !(await bcrypt.compare(password, user.password))) {
            response = {
                status: false,
                message: "Utilisateur/mot de passe incorect"
            }
            return res.status(401).json(response)
        }
        const secretKey = process.env.SECRET_KEY;
        const payload = {
            utilisateurId: user.id,
            email: user.email,
            role: user.role
        };
        const options = {
            expiresIn: '1h'
        };
        const token = jwt.sign(payload, secretKey, options);  
        response = {
            status: true,
            data: token
        }
        res.json(response);
    } catch {
        response = {
            status: false,
            message: "Erreur interne du serveur"
        }
        return res.status(500).json(response);
    }
})

module.exports = router