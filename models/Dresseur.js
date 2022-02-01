import mongoose from 'mongoose';


const dresseurSchema = new mongoose.Schema({
    name: String,
    pokemons: Array,
    totalPokemon: {type: Number, default: 0},
    badge: {type: Number, default: 0}

})

const Dresseur = mongoose.model('Dresseur', dresseurSchema)

export default Dresseur;