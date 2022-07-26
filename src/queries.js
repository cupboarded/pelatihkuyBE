const Pool = require('pg').Pool
const pool = new Pool ({
    user: 'me',
    password: 'password',
    host: 'localhost',
    database: 'pelatihkuy',
    port: 5432
})

async function aPQ(fullName, playingNum, teamID, height, position) {
    try {
        const res = await pool.query(
            'INSERT INTO Players(fullName, playingNum, teamID, height, position) VALUES ($1, $2, $3, $4, $5) RETURNING id;',
            [fullName, playingNum, teamID, height, position]
        )

        var queryResult = JSON.stringify(res["rows"][0])
        queryResult = JSON.parse(queryResult)["id"]

        return queryResult
    } catch (err) {
        return err.stack
    }
}

const addPlayer = async (request, response) => {
    const {
        fullName,
        playingNum,
        teamID,
        height,
        position
    } = request.body;

    var queryResult = await aPQ(fullName, playingNum, teamID, height, position);
    
    response.status(201).json(queryResult)

    pool.query(
        'INSERT INTO IndividualStats(playerID) VALUES ($1);',
        [queryResult],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(201)
        }
    )
}

const addTeam = (request, response) => {
    const {
        teamName,
        shortName
    } = request.body

    var queryResult;

    pool.query(
        'INSERT INTO Teams(teamName, shortName) VALUES ($1, $2) RETURNING id;',
        [teamName, shortName], 
        (error, results) => {
            if (error) {
                throw error
            }

            queryResult = JSON.stringify(results["rows"][0])
            queryResult = JSON.parse(queryResult)["id"]

            response.status(201).json(queryResult)
        }
    )
}

async function aGQ1(playedOn, playedAt, gender, category) {
    try {
        const res = await pool.query(
            'INSERT INTO Games(playedOn, playedAt, gender, category) VALUES ($1, $2, $3, $4) RETURNING id;',
            [playedOn, playedAt, gender, category]
        )

        var queryResult = JSON.stringify(res["rows"][0])
        queryResult = JSON.parse(queryResult)["id"]

        return queryResult
    } catch (err) {
        return err.stack
    }
}

async function aGQ2(teamID, gameID) {
    try {
        const res = await pool.query(
            'INSERT INTO Involves(teamID, gameID) VALUES ($1, $2);',
            [teamID, gameID]
        )
    } catch (err) {
        return err.stack
    }
}

async function aGQ3(gameID) {
    try {
        const res = await pool.query(
            'INSERT INTO GameStats(gameID) VALUES ($1);',
            [gameID]
        )
    } catch (err) {
        return err.stack
    }
}

async function aGQ4(team1ID, team2ID) {
    try {
        const res = await pool.query(
            'SELECT * FROM Players WHERE teamID = $1 OR teamID = $2;',
            [team1ID, team2ID]
        )

        return res["rows"]
    } catch (err) {
        return err.stack
    }
}

async function aGQ5(gameID, playerID) {
    try {
        const res = await pool.query(
            'INSERT INTO PlayerGameStats(gameID, playerID) VALUES ($1, $2);',
            [gameID, playerID]
        )
    } catch (err) {
        return err.stack
    }
}

const addGame = async (request, response) => {
    const {
        team1ID,
        team2ID,
        playedOn,
        playedAt,
        gender,
        category
    } = request.body

    var gameID = await aGQ1(playedOn, playedAt, gender, category);
    
    response.status(201).json(gameID)

    await aGQ2(team1ID, gameID)

    await aGQ2(team2ID, gameID)

    await aGQ3(gameID)
    
    var playerIDs = await aGQ4(team1ID, team2ID)

    for (var i = 0; i < playerIDs.length; i++) {
        var player = playerIDs[i]
        player = JSON.stringify(player)
        var playerID = JSON.parse(player)["id"]

        await aGQ5(gameID, playerID)
    }
}

const allTeams = (request, response) => {
    pool.query(
        'SELECT * FROM Teams;',
        [],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(201).json(results["rows"])
        }
    )
}

const teamDetails = (request, response) => {
    const {
        teamID
    } = request.body

    pool.query(
        'SELECT * FROM Teams WHERE id = $1;',
        [teamID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).json(results["rows"])
        }
    )
}

const teamPlayers = (request, response) => {
    const {
        teamID
    } = request.body

    pool.query(
        'SELECT * FROM Players WHERE teamID = $1;',
        [teamID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).json(results["rows"])
        }
    )
}

const allPlayers = (request, response) => {
    pool.query(
        'SELECT * FROM Players;',
        [],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).json(results["rows"])
        }
    )
}

const playerDetails = (request, response) => {
    const {
        playerID
    } = request.body

    pool.query(
        'SELECT * FROM Players WHERE id = $1;',
        [playerID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).json(results["rows"])
        }
    )
}

const leaderboard = (request, response) => {
    pool.query(
        'SELECT * FROM Leaderboard;',
        [],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).json(results["rows"])
        }
    )
}

const gamesAfterDate = (request, response) => {
    const {
        afterDate
    } = request.body

    pool.query(
        'SELECT * FROM Games WHERE playedOn >= $1',
        [afterDate],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).json(results["rows"])
        }
    )
}

const gameDetails = (request, response) => {
    const {
        gameID
    } = request.body

    pool.query(
        "SELECT string_agg(Teams.shortName, ' vs ') as teams, string_agg(Teams.id::text, ' vs ') as teamsID, Games.playedOn as playedOn, Games.playedAt as playedAt, Games.gender as gender, Games.category as category FROM Teams JOIN Involves on Teams.id = Involves.teamID JOIN Games on Involves.gameID = Games.id WHERE Games.id = $1 GROUP BY Games.id;",
        [gameID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).json(results["rows"])
        }
    )
}

const gamesByTeam = (request, response) => {
    const {
        teamID
    } = request.body

    pool.query(
        'SELECT gameID FROM Involves WHERE teamID = $1;',
        [teamID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).json(results["rows"])
        }
    )
}

const gameStatistics = (request, response) => {
    const {
        gameID
    } = request.body

    pool.query(
        'SELECT * FROM GameStats WHERE gameID = $1;',
        [gameID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).json(results["rows"])
        }
    )
}

const playerStatistics = (request, response) => {
    const {
        playerID
    } = request.body

    pool.query(
        'SELECT * FROM IndivididualStats WHERE playerID = $1;',
        [playerID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).json(results["rows"])
        }
    )
}

const playerGameStatistics = (request, response) => {
    const {
        playerID, gameID
    } = request.body

    pool.query(
        'SELECT * FROM PlayerGameStats WHERE playerID = $1 AND gameID = $2;',
        [playerID, gameID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).json(results["rows"])
        }
    )
}

const updateTeamDet = (request, response) => {
    const {
        teamID,
        attributeToChange,
        value
    } = request.body

    pool.query(
        `UPDATE Teams SET ${attributeToChange} = $1 WHERE id = $2;`,
        [value, teamID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).send(`Successful ${attributeToChange} change for ${teamID}`)
        }
    )
}
 
const updateGameDet = (request, response) => {
    const {
        gameID,
        attributeToChange,
        value
    } = request.body

    pool.query(
        `UPDATE Games SET ${attributeToChange} = $1 WHERE id = $2;`,
        [value, gameID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).send(`Successful ${attributeToChange} change for ${gameID}`)
        }
    )
}

const updateGame = (request, response) => {
    const {
        gameID,
        teamID
    } = request.body

    pool.query(
        'UPDATE Involves SET teamID = $1 WHERE gameID = $2;',
        [teamID, gameID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).send(`Successful gameID change to team ${teamID}`)
        }
    )
}

const updatePlayerDet = (request, response) => {
    const {
        playerID,
        attributeToChange,
        value
    } = request.body

    pool.query(
        `UPDATE Players SET ${attributeToChange} = $1 WHERE id = $2;`,
        [value, playerID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).send(`Successful ${attributeToChange} change for ${playerID}`)
        }
    )
}

const updatePlayerStats = (request, response) => {
    const {
        playerID,
        attributeToChange,
        value
    } = request.body

    pool.query(
        `UPDATE IndividualStats SET ${attributeToChange} = $1 WHERE playerID = $2;`,
        [value, playerID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).send(`Successful ${attributeToChange} change for ${playerID}`)
        }
    )
}

const updateGameStats = (request, response) => {
    const {
        gameID,
        attributeToChange,
        value
    } = request.body

    pool.query(
        `UPDATE GameStats SET ${attributeToChange} = '${value}' WHERE gameID = $1;`,
        [gameID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).send(`Successful ${attributeToChange} change for ${gameID}`)
        }
    )
}

const updatePlayerGameStats = (request, response) => {
    const {
        playerID,
        gameID,
        attributeToChange,
        value
    } = request.body

    pool.query(
        `UPDATE PlayerGameStats SET ${attributeToChange} = $1 WHERE gameID = $2 AND playerID = $3;`,
        [value, gameID, playerID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).send(`Successful ${attributeToChange} change for game ${gameID} player ${playerID}`)
        }
    )
}

const deleteGame = (request, response) => {
    const {
        gameID
    } = request.body

    pool.query(
        'DELETE FROM Games WHERE id = $1;',
        [gameID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).send(`Successful delete of game ${gameID}`)
        }
    )
}

const deletePlayer = (request, response) => {
    const {
        playerID
    } = request.body

    pool.query(
        'DELETE FROM Players WHERE id = $1;',
        [playerID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).send(`Successful delete of player ${playerID}`)
        }
    )
}

const deleteTeam = (request, response) => {
    const {
        teamID
    } = request.body

    pool.query(
        'DELETE FROM Teams WHERE id = $1;',
        [teamID],
        (error, results) => {
            if (error) {
                throw error
            }

            response.status(200).send(`Successful delete of team ${teamID}`)
        }
    )
}

module.exports = {
    addPlayer,
    addTeam,
    addGame,
    allTeams,
    teamDetails,
    teamPlayers,
    allPlayers,
    playerDetails,
    leaderboard,
    gamesAfterDate,
    gameDetails,
    gamesByTeam,
    gameStatistics,
    playerStatistics,
    playerGameStatistics,
    updateTeamDet,
    updateGameDet,
    updateGame,
    updatePlayerDet,
    updatePlayerStats,
    updateGameStats,
    updatePlayerGameStats,
    deleteGame,
    deletePlayer,
    deleteTeam
}