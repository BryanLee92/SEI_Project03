require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
const lyricsFinder = require("lyrics-finder")
const SpotifyWebApi = require("spotify-web-api-node")

const musicApi = require('./models/music.js')

//port
const PORT = process.env.PORT || 3030;

const mongoURI = process.env.MONGODB_URI || "mongodb+srv://Nudels:mick3ymous@foodie.6p9ujvd.mongodb.net/Music_App"
const db = mongoose.connection
mongoose.connect(mongoURI, {useNewUrlParser: true}, ()=>{
    console.log("Connected")
})
db.on("error", (err)=>{
    console.log(err.message)
});
db.on("disconnect", ()=>{
    console.log("MongoDB disconnected")
});


const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})

app.post("/login", (req, res) => {
  const code = req.body.code
  musicApi.create(req.body, (err, data) => {
    if (err) {
      res.status(400).json({err: err.message})
    }else{
      const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
      })
      spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
          res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in,
          })
        })
        .catch(err => {
          res.sendStatus(400)
        })
    }
  })
})

app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
  res.json({ lyrics })
})

//listener
app.listen(PORT, ()=>{
  console.log(`Listening at port: ${PORT}`)
})
