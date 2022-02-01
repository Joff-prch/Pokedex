import express from "express";
import bodyParser from "body-parser";
import Mongoose from "mongoose";
import Dresseur from "./models/Dresseur.js";
import cookieParser from "cookie-parser";
import Pokemon from "./models/Pokemon.js";
import { Helper } from "./assets/helper/helper.js";
import axios from "axios";


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
        res.cookie('dresseurID', connexion._id, { maxAge: 9000000 })
        res.redirect('/pokedex');
        console.log("connexion accepté");
    } else {
        res.render('connexion.twig', {
            error : "Ce Dresseur n'existe pas"
        })
    }
})


app.get('/inscription', async (req, res) => {
    res.render('inscription.twig')
})


app.post('/inscription', async (req, res) => {
    let connexion = await Dresseur.findOne({ name: req.body.name });
    if (connexion != null) {
        res.render('inscription.twig', {
            error: "Ce dresseur existe déjà"
        })
    } else {
        const dresseur = new Dresseur(req.body);
        dresseur.save();
        res.redirect('/');
    }
})




app.get('/pokedex/', async (req, res) => {
    let coocki = req.cookies.dresseurID;
    const dresseur = await Dresseur.findOne({ _id: coocki })
    let pokemons = dresseur.pokemons
    let currentPokemons = pokemons.length;
    let totalPokemons = dresseur.totalPokemon
    let badges = dresseur.badge

    res.render('pokedex.twig', {
        pokemons: pokemons,
        totalPokemons: totalPokemons,
        currentPokemons: currentPokemons,
        badges: badges
    });

})



app.get('/addPokemon', async (req, res) => {
    res.render('./template/addPokemon.twig')
    // const poke = await axios.get("https://pokeapi.co/api/v2/pokemon/"+Helper.rand())
    // console.log(poke.data.species.name);
})


app.post('/addPokemon', async (req, res) => {
    let coocki = req.cookies.dresseurID
    const pokemon = await new Pokemon(req.body);
    const dresseur = await Dresseur.findOne({ _id: coocki })
    await Dresseur.findOneAndUpdate(
        { _id: coocki },
        { $push: { pokemons: pokemon } },
    );
    await Dresseur.findOneAndUpdate(
        { _id: coocki },
        { $inc: { totalPokemon: 1 } },
    );
    await dresseur.save();
    const dresseurUpdate = await Dresseur.findOne({ _id: coocki });
    let totalPokemons = dresseurUpdate.totalPokemon
    let badges = dresseurUpdate.badge
    let nbBadge = dresseurUpdate.badge

    if (totalPokemons > 17) {
        if (badges < 8) {
            let calculBadge = totalPokemons % 18 == 0
            if (calculBadge == 1) {
                nbBadge++
            }
            await Dresseur.findOneAndUpdate(
                { _id: coocki },
                { badge: nbBadge } ,
            );
        }
    }

    await dresseurUpdate.save();
    res.redirect('/pokedex');
})




app.get('/updatePokemon/:id', async (req, res) => {
    let coocki = req.cookies.dresseurID;
    let url = req.params.id;
    let dresseur = await Dresseur.findOne({ _id: coocki })
    let pokemon = dresseur.pokemons;
    for (let i = 0; i < pokemon.length; i++) {
        if (pokemon[i]._id == url) {
            pokemon = pokemon[i];
            break;
        }
    }
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

    await Dresseur.updateOne({ _id: coocki }, { pokemons: card.pokemons })
    res.redirect('/pokedex');
});






app.get('/deletePokemon/:id', async (req, res) => {
    let coocki = req.cookies.dresseurID;
    let url = req.params.id;
    let dresseur = await Dresseur.findOne({ _id: coocki })
    let pokemon = dresseur.pokemons;
    await Helper.findPokemon(pokemon, url)
    await dresseur.save();
    res.redirect('/pokedex')

});

