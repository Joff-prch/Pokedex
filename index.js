import express from "express";
import bodyParser from "body-parser";
import Mongoose from "mongoose";
import Dresseur from "./models/Dresseur.js";
import cookieParser from "cookie-parser";
import Pokemon from "./models/Pokemon.js";


const app = express();
const db = "mongodb+srv://joff:ri7mdb@cluster0.abvtv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

Mongoose.connect(db, err => {
    if (err) {
        console.error('error ' + err);
    } else {
        console.log('MongoDB ok');
    }
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(express.static('./assets'));
app.listen(8080, () => {
    console.log('Le serveur marche');
})




app.get('/', async (req, res) => {
    res.render('connexion.twig')
})

app.post('/', async (req, res) => {
    const dresseurName = req.body.loginName;
    let connexion = await Dresseur.findOne({ name: dresseurName });
    if (connexion != null) {
        res.cookie('dresseurID', connexion._id, { maxAge: 900000 })
        res.redirect('/pokedex');
        console.log("connexion accepté");
    } else {
        res.render('connexion.twig')
    }
})


app.get('/inscription', async (req, res) => {
    res.render('inscription.twig')
})


app.post('/inscription', async (req, res) => {
    const dresseur = new Dresseur(req.body);
    dresseur.save();
    res.redirect('/');
})


app.get('/pokedex/', async (req, res) => {
    let coocki = req.cookies.dresseurID;
    const user = await Dresseur.findOne({ _id: coocki })
    let pokemons = user.pokemons

    res.render('pokedex.twig', {
        pokemons: pokemons
    });

})


app.get('/addPokemon', async (req, res) => {
    res.render('./template/addPokemon.twig')
})


app.post('/addPokemon', async (req, res) => {
    let coocki = req.cookies.dresseurID
    const pokemon = await new Pokemon(req.body);
    await Dresseur.findOneAndUpdate(
        { _id: coocki },
        { $push: { pokemons: pokemon } },
    );
    res.redirect('/pokedex');
})




app.get('/updatePokemon/:id', async (req, res) => {
    let coocki = req.cookies.dresseurID;
    let url = req.params.id;
    let dresseur = await Dresseur.findOne({ _id: coocki })
    let pokemon = dresseur.pokemons;
    await findPokemon(pokemon, url);
    res.render('./template/addPokemon.twig', {
        pokemons: pokemon,
        action: "/updatePokemon"
    })
})




app.post('/updatePokemon/:id', async (req, res) => {
    let coocki = req.cookies.dresseurID;
    let url = req.params.id;
    const card = await Dresseur.findOne({ _id: coocki });
    const index = card.pokemons.findIndex(pokemons => pokemons._id == url);

    card.pokemons[index]._id = Date.now();
    card.pokemons[index].name = req.body.name;
    card.pokemons[index].pv = req.body.pv;
    card.pokemons[index].dps = req.body.dps;

    Dresseur.updateOne({ _id: coocki}, { pokemons: card.pokemons } , (error, dresseur) => {
        if(error){
            console.log(error);
            res.status(404);
        }else{
            res.redirect('/pokedex')
        }
    })
});






app.get('/deletePokemon/:id', async (req, res) => {
    let coocki = req.cookies.dresseurID;
    let url = req.params.id;
    let user = await Dresseur.findOne({_id: coocki})
    let pokemon = user.pokemons;
    await splicePokemon(pokemon, url);
    await Dresseur.updateOne({_id: coocki}, {pokemons : pokemon})
    res.redirect('/pokedex')
   
});

function splicePokemon(pokemon, url){
    for(let i = 0; i < pokemon.length; i++){
        if(pokemon[i]._id == url){
            console.log('spliced' + pokemon[i]);
            pokemon = pokemon.splice(pokemon[i],1);
            break;
        }
    } 
    return pokemon
}

function findPokemon(pokemon, url){
    for(let i = 0; i < pokemon.length; i++){
        if(pokemon[i]._id == url){
            console.log('finded' + pokemon[i]);
            pokemon = pokemon[i];
            break;
        }
    } 
    return pokemon
}

