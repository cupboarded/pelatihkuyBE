const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');
const app = express();
const port = 3000;
const db = require('./queries')

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.listen(port, () => {
    console.log('App running on port ' + port)
});

app.get('/', (request, response) => {
    response.json({ info: 'API for pelatihkuy, using PostgreSQL' })
});

app.post('/addplayer', db.addPlayer);

app.post('/addteam', db.addTeam);

app.post('/addgame', db.addGame);

app.get('/allteams', db.allTeams);

app.get('/teamdetails', db.teamDetails);

app.get('/teamplayers', db.teamPlayers);

app.get('/allplayers', db.allPlayers);

app.get('/playerdetails', db.playerDetails);

app.get('/leaderboard', db.leaderboard);

app.get('/allgamesafter', db.gamesAfterDate);

app.get('/gamedetails', db.gameDetails);

app.get('/gamesbyteam', db.gamesByTeam);

app.get('/gamestatistics', db.gameStatistics);

app.get('/playerstatistics', db.playerStatistics);

app.get('/playergamestatistics', db.playerGameStatistics);

app.put('/updateteamdetails', db.updateTeamDet);

app.put('/updategamedetails', db.updateGameDet);

app.put('/updategame', db.updateGame);

app.put('/updateplayerdetails', db.updatePlayerDet);

app.put('/updateplayerstatistics', db.updatePlayerStats);

app.put('/updategamestatistics', db.updateGameStats);

app.put('/updateplayergamestatistics', db.updatePlayerGameStats);

app.delete('/deletegame', db.deleteGame);

app.delete('/deleteplayer', db.deletePlayer);

app.delete('/deleteteam', db.deleteTeam);