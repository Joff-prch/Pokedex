import mongoose from 'mongoose';

const dresseurSchema = new mongoose.Schema({
    name: String
})

const Dresseur = mongoose.model('Dresseur', dresseurSchema)

export default Dresseur;