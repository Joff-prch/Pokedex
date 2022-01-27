import mongoose from 'mongoose';


const dresseurSchema = new mongoose.Schema({
    name: String,
    pokemons: Array
})

const Dresseur = mongoose.model('Dresseur', dresseurSchema)

export default Dresseur;