export class Helper{
    static findPokemon(pokemon, url){
        for (let i = 0; i < pokemon.length; i++) {
            if (pokemon[i]._id == url) {
                    pokemon.splice(i, 1);
                    break;
            }
        }
        return pokemon
    }
    static rand(){
        return Math.floor(Math.random() * (151 - 1)) + 1;
    }
}