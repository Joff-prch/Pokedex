import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
    name: String,
    pv: Number,
    dps: Number,
    type: String,
    src: String
})

const Pokemon = mongoose.model('Pokemon', pokemonSchema)

export default Pokemon;