import express from "express";
import bodyParser from "body-parser";
import  Mongoose  from "mongoose";
import Dresseur from "./models/Dresseur.js";
import cookieParser from "cookie-parser";
import Pokemon from "./models/Pokemon.js";


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
app.use(cookieParser());
app.use(express.static('./assets'));
app.listen(8080, () =>{
    console.log('Le serveur marche');
})




app.get('/', async (req, res) =>{
    res.render('connexion.twig')
})

app.post('/', async (req, res) =>{
    const dresseurName = req.body.loginName;
    let connexion = await Dresseur.findOne({name: dresseurName});
    if(connexion != null){
        res.cookie('dresseurID', connexion._id, {maxAge: 900000})
        res.redirect('/pokedex');
        console.log("connexion accepté");
    }else {
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



app.get('/addPokemon', async (req, res)=>{

    res.render('./template/addPokemon.twig')
})

app.post('/addPokemon', async (req, res) =>{
    let coocki = req.cookies.dresseurID
    const pokemon = await new Pokemon(req.body);
    await Dresseur.findOneAndUpdate(
        { _id: coocki },
        { $push: {pokemons:pokemon} },
        );
    res.redirect('/pokedex');
})


app.get('/updatePokemon/:id', async (req, res) =>{

    const pokemon = await Pokemon.findOne({_id: req.params.id});
    res.render('./template/addPokemon.twig', {
        pokemon: pokemon,
        action: "/updatePokemon"
    })
})


app.post('/updatePokemon/:id', async (req, res) =>{
    Pokemon.updateOne({_id: req.params.id}, req.body, (error, pokemon)=>{
        if(error){
            console.log(error);
            res.status(404)
        }else {
            res.redirect('/')
        }
    })
})




app.get('/pokedex/', async (req, res) =>{
    let coocki = req.cookies.dresseurID;
    const user =  await Dresseur.findOne({ _id: coocki })
    let pokemons = user.pokemons

        res.render('pokedex.twig', {
            pokemons: pokemons
        });

})


app.get('/deletePokemon/:id', async (req, res) =>{
    let coocki = req.cookies.dresseurID;
    const user =  await Dresseur.findOne({ _id: coocki })
    let pokemons = user.pokemons
    Dresseur.deleteOne({_id: coocki}, (error, pokemon) =>{
        if(error){
            console.log(error);
            res.status(404);
        }else {
            res.redirect('/pokedex')
        }
    })

})