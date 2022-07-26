INSERT INTO Teams(teamName, shortName) VALUES 
    ('Boston Celtics', 'BOS'),
    ('Brooklyn Nets', 'BKN'),
    ('Milwaukee Bucks', 'MIL'),
    ('Miami Heat', 'MIA');

INSERT INTO Games(playedOn, playedAt) VALUES
    ('2022-04-18', 'Boston'),
    ('2022-05-14', 'Milwaukee'),
    ('2022-05-30', 'Miami');

INSERT INTO Involves(teamID, gameID) VALUES
    (1, 1),
    (2, 1),
    (1, 2),
    (3, 2),
    (1, 3),
    (4, 3);