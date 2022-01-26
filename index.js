import express from "express";
import bodyParser from "body-parser";
import  Mongoose  from "mongoose";
import Dresseur from "./models/Dresseur.js";


const app = express();
const db = "mongodb+srv://joff:ri7mdb@cluster0.abvtv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

Mongoose.connect(db, err =>{
    if(err){
        console.error('error ' + err);
    }else {
        console.log('MongoDB ok');
    }
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('./assets'));
app.listen(8080, () =>{
    console.log('Le serveur marche');
})


app.get('/', async (req, res) =>{
    res.render('connexion.twig')
})

app.post('/', async (req, res) =>{
    const dresseurName = req.body.loginName;
    let test = await Dresseur.findOne({name: dresseurName});
    console.log(test);
    if(test != null){
        res.redirect('/pokedex');
        console.log("c'est bon");
    }else {
        console.log('pas bon');
        res.render('connexion.twig')
    }
})


app.get('/inscription', async (req, res) =>{
    res.render('inscription.twig')
})



app.post('/inscription', async (req, res) =>{
    const dresseur = new Dresseur(req.body);
    dresseur.save();
    res.redirect('/');
})

app.get('/addUser', async (req, res) =>{
    res.render('inscription.twig', {

    })
})

app.get('/pokedex', async (req, res) =>{
    res.render('pokedex.twig')
})