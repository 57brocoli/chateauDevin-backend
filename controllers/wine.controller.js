const express = require("express")
const router = express.Router();
const WineMethodes = require('../services/wine.methodes')
const wineMethodes = new WineMethodes();
let response

router.get("/alls", async (req, res) => {
    try{
        const wines = await wineMethodes.getAllWines()
        response = {
            status: true,
            data: wines
        }
        res.json(response)
    }catch{
        response = {
            status: false,
            message: "Erreur interne du serveur"
        }
        res.status(500).json(response)
    }
})
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id)
    try{
        const wine = await wineMethodes.findWineById(id)
        res.json({
            status: true,
            data: wine
        })
    }catch{
        res.status(500).json({
            status: false,
            message: "Erreur interne du serveur"
        })
    }
})

router.post("/new", async (req, res) => {
    try{
        const wine = req.body

        // Validation des données
        if (!wine.name) {
            return res.status(400).json({
                status: false,
                message: "Données manquantes ou invalides"
            });
        }

        // Vérification si le vin existe déjà
        // const existingWine = await wineMethodes.findWineByName(wine.name)
        // if (existingWine) {
        //     return res.status(400).json({
        //         status : false,
        //         message : "vin deja existant"
        //     })
        // }

        // Ajout du nouveau vin
        await wineMethodes.addWine(wine)
        res.status(201).json({
            status : true,
            data : wine
        });
    }catch (error){
        console.error("Erreur lors de l'ajout du vin:", error);
        res.status(500).json({
            status : false,
            message: "Erreur interne du serveur",
        })
    }
})

//modification
// router.put("/edit/:id", (req, res) => {
//     res.json({messageId : req.params.id})
// })

// router.delete("/delete/:id", (req, res) => {
//     res.json({messageId : `post ${req.params.id} supprimer`})
// })
//pour ajouter quelque chose
// router.patch("/like/:id", (req, res) => {
//     res.json({messageId : `le post ${req.params.id} est liké`})
// })
// router.patch("/dislike/:id", (req, res) => {
//     res.json({messageId : `le post ${req.params.id} est liké`})
// })


module.exports = router