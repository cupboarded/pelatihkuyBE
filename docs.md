# pelatihkuy Documentation

## Endpoints

### POST
- POST: Add new player
    - Sets individual stats to 0

> /addplayer
Parameters: fullName, playingNum, teamID, height, position
Returns: playerID

- POST: Add new team
> /addteam
Parameters: teamName, shortName
Returns: teamID

- POST: Add new game
    - Will add to both Games and Involves tables
    - Will set game stats to 0
    - Will set all player stats for the game to 0

> /addgame
Parameters: team1ID, team2ID, playedOn (date), playedAt, gender, category
Returns: gameID

### GET
- GET: Get all teams
> /allteams
Parameters: none
Returns: (for all teams) id, teamName, shortName

- GET: Get individual team details
> /teamdetails
Parameters: teamID
Returns: teamName, shortName, players (list of players), games (list of last 5 games)

- GET: Get team players
> /teamplayers
Parameters: teamID
Returns: players (list of players)

- GET: Get all players
> /allplayers
Parameters: none
Returns: players (list of players)

- GET: Get player details
> /playerdetails
Parameters: playerID
Returns: fullName, playingNum, teamID, height, position

- GET: Get leaderboard
> /leaderboard
Parameters: none
Returns: teamNames, numWins

- GET: Get all games after date
> /allgamesafter
Parameters: afterDate
Returns: gamesAfterDate (playedOn, playedAt, team1ID, team2ID)

- GET: Get game details
    - Will send both details of the game and who is involved (2 different tables)

> /gamedetails
Parameters: gameID
Returns: playedOn, playedAt, team1ID, team2ID, gender, category

- GET: Get games played by a certain team
> /gamesbyteam
Parameters: teamID
Returns: gamesByTeam (gameIDs)

- GET: Get game statistics
> /gamestatistics
Parameters: gameID
Returns: winner, score, biggestLead, timeWithLead, fastBreakPts, ptsInPaint, leadChanges, ptsFromTOS, timesTied, secChncPts, benchPts, biggestScrRun

- GET: Get individual statistics
> /playerstatistics
Parameters: playerID
Returns: gamesPlayed, avgPoints, avgMins, avg3FGPtg, avgFGPtg, avgFTPtg, avgAssists, avgRebs, avgBlocks, avgSteaks, avgTurnovers

- GET: Get player statistical details for a certain game
> /playergamestatistics
Parameters: playerID, gameID
Returns: FG, FGPtg, 2FG, 2FGPtg, 3FG, 3FGPtg, FT, FTPtg, defRebs, offRebs, totalRebs, assists, blocks, points, minsPlayed, plusMinus, steals, turnovers, PF, FD, efficiency

### PUT
- PUT: Update team details
> /updateteamdetails
Parameters: teamID, attributeToChange, value
Returns: none

- PUT: Update game details
> /updategamedetails
Parameters: gameID, attributeToChange, value
Returns: none

- PUT: Update game 
> /updategame
Parameters: gameID, teamID
Returns: none

- PUT: Update player details
> /updateplayerdetails
Parameters: playerID, attributeToChange, value
Returns: none

- PUT: Update player statistics
> /updateplayerstatistics
Parameters: playerID, attributeToChange, value
Returns: none

- PUT: Update game statistical details
> /updategamestatistics
Parameters: gameID, attributeToChange, value
Returns: none

- PUT: Update player statistics for a certain game
> /updateplayergamestatistics
Parameters: playerID, gameID, attributeToChange, value
Returns: none

### DELETE
- DELETE: Delete game
    - Deletes game, game statistics and individual statistics per game
    - Deletes the record of that game from averages (maybe)

> /deletegame
Parameters: gameID
Returns: none

- DELETE: Delete player
    - Also deletes player from team records
    - Deletes player statistics

> /deleteplayer
Parameters: playerID
Returns: none

- DELETE: Delete team
    - Deletes all players that play for that team as they need to have a team

> /deleteteam
Parameters: teamID
Returns none