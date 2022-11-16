const mongoose =require("mongoose")
const Schema = mongoose.Schema

const spotifyApi = new Schema({
    code: String,
    },
    {timestamps: true}
)
module.exports = mongoose.model('spotifyApi', spotifyApi)