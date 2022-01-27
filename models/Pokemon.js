import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
    name: String,
    pv: Number,
    dps: Number
})

const Pokemon = mongoose.model('Pokemon', pokemonSchema)

export default Pokemon;