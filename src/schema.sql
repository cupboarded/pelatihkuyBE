-- SQL Database schema for FIBA games

-- Positions for each player
-- If belongs to two positions, fill with general position
-- (example a two guard PG SG can just be a G, or a PF/C can be a F)
CREATE DOMAIN Positions AS varchar(2) CHECK (VALUE IN ('G', 'PG', 'SG', 'SF', 'F', 'PF', 'C'));

-- Gender category for each of the games
-- Belongs to male, female, or n/a if it is mixed
CREATE DOMAIN GenderCategory AS varchar(2) CHECK (VALUE IN ('Pa', 'Pi', 'na'));

-- Comparison of scores for game statistics
-- A string of two numbers from 0-999 separated by a dash
-- (example is '99-93')
CREATE DOMAIN Comparisons AS varchar(7);

-- Fraction for field goal representation
-- A string of two numbers from 0-99 separated by a / to represent fraction
CREATE DOMAIN Fraction AS varchar(5);

-- Text to represent minutes played
-- A string of two numbers from 0-99 separated by a : to represent mp
-- (example is '42:03')
CREATE DOMAIN MinutesPlayed AS varchar(5);

CREATE TABLE Teams (
    id serial,
    teamName text NOT NULL,
    shortName char(3) NOT NULL,
    primary key (id)
);

CREATE TABLE Games (
    id serial,
    playedOn date,
    playedAt text,
    gender GenderCategory,
    category text,
    primary key (id)
);

CREATE TABLE Involves (
    gameID integer NOT NULL,
    teamID integer NOT NULL,
    foreign key (teamID) references Teams(id) ON DELETE CASCADE,
    foreign key (gameID) references Games(id) ON DELETE CASCADE,
    primary key (teamID, gameID)
);

CREATE TABLE Players (
    id serial,
    fullName text NOT NULL,
    playingNum integer,
    teamID integer NOT NULL,
    height integer CHECK (height BETWEEN 0 AND 250),
    position Positions,
    foreign key (teamID) references Teams(id) ON DELETE CASCADE,
    primary key (id)
);

CREATE TABLE IndividualStats (
    playerID integer,
    gamesPlayed integer DEFAULT 0,
    avgPoints decimal DEFAULT 0,
    avgMins decimal DEFAULT 0,
    avg3FGPtg integer DEFAULT 0,
    avgFGPtg integer DEFAULT 0,
    avgFTPtg integer DEFAULT 0,
    avgAssists decimal DEFAULT 0,
    avgRebs decimal DEFAULT 0,
    avgBlocks decimal DEFAULT 0,
    avgSteals decimal DEFAULT 0,
    avgTurnovers decimal DEFAULT 0,
    foreign key (playerID) references Players(id) ON DELETE CASCADE,
    primary key (playerID)
);

-- For game stats where there are two values (one for each team), domain Comparisons are used.
-- It will be in the format x-y, where x is for team 1 and y is for team 2
CREATE TABLE GameStats (
    gameID integer,
    winner integer,
    score varchar(7) DEFAULT '0-0',
    biggestLead Comparisons DEFAULT '0-0',
    timeWithLead Comparisons DEFAULT '0-0',
    fastBreakPts Comparisons DEFAULT '0-0',
    ptsInPaint Comparisons DEFAULT '0-0',
    leadChanges integer DEFAULT 0,
    ptsFromTOS Comparisons DEFAULT '0-0',
    timesTied integer DEFAULT 0,
    secChncPts Comparisons DEFAULT '0-0',
    benchPts Comparisons DEFAULT '0-0',
    biggestScrRun Comparisons DEFAULT '0-0',
    foreign key (gameID) references Games(id) ON DELETE CASCADE,
    foreign key (winner) references Teams(id) ON DELETE CASCADE,
    primary key (gameID)
);

CREATE TABLE PlayerGameStats (
    gameID integer,
    playerID integer,
    FG Fraction DEFAULT '0/0',
    FGPtg decimal DEFAULT 0,
    twoFG Fraction DEFAULT '0/0',
    twoFTPtg decimal DEFAULT 0,
    threeFG Fraction DEFAULT '0/0',
    threeFGPtg decimal DEFAULT 0,
    FT Fraction DEFAULT '0/0',
    FTPtg decimal DEFAULT 0,
    defRebs integer DEFAULT 0,
    offRebs integer DEFAULT 0,
    totalRebs integer DEFAULT 0,
    assists integer DEFAULT 0,
    blocks integer DEFAULT 0,
    points integer DEFAULT 0,
    minsPlayed MinutesPlayed DEFAULT '0:0',
    plusMinus integer DEFAULT 0,
    steals integer DEFAULT 0,
    turnovers integer DEFAULT 0,
    PF integer DEFAULT 0,
    FD integer DEFAULT 0,
    efficiency integer DEFAULT 0,
    foreign key (gameID) references Games(id) ON DELETE CASCADE,
    foreign key (playerID) references Players(id) ON DELETE CASCADE,
    primary key (gameID, playerID)
);

CREATE VIEW Winners AS
SELECT Teams.shortName AS Team
FROM Teams 
JOIN Involves ON Teams.id = Involves.teamID
JOIN GameStats ON Involves.gameID = GameStats.gameID
WHERE Teams.id = GameStats.winner;

CREATE VIEW Leaderboard AS
SELECT Winners.Team AS Team, count(*) AS Wins
FROM Winners
GROUP BY Team
ORDER BY Wins DESC;