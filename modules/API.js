const DB = require('./SQL');

exports.getTeams = async (allinfo = false) => {
    let res = [];

    let teams = await DB.getTeams();
    let schools = await DB.getSchools();
    let leagues = await DB.getLeagues();
    let players = await DB.getPlayers();

    for (var i in teams) {
        let temp = {
            id: teams[i].ID,
            name: schools.filter(s => s.ID == teams[i].schoolID)[0].teamName,
            abbrev: schools.filter(s => s.ID == teams[i].schoolID)[0].abbrev,
            logo: schools.filter(s => s.ID == teams[i].schoolID)[0].logo,
        }

        if (allinfo) {
            temp["school"] = {
                id: teams[i].schoolID,
                name: schools.filter(s => s.ID == teams[i].schoolID)[0].name,
                socials: {
                    instagram: schools.filter(s => s.ID == teams[i].schoolID)[0].igURL,
                    twitter: schools.filter(s => s.ID == teams[i].schoolID)[0].twitterURL,
                    twitch: schools.filter(s => s.ID == teams[i].schoolID)[0].twitchURL,
                }
            };

            temp["league"] = {
                id: teams[i].leagueID,
                title: leagues.filter(l => l.ID == teams[i].leagueID)[0].title,
            }

            temp["manager"] = {
                name: null,
                IGN: null
            } // TODO Add managers to database

            temp["coach"] = {
                name: null,
                IGN: null
            } // TODO Add coaches to database

            temp["players"] = [];

            let teamPlayers = players.filter(p => p.teamID == teams[i].ID);
            for (var j in teamPlayers) {
                temp.players.push({
                    id: teamPlayers[j].id,
                    firstName: teamPlayers[j].firstName,
                    lastName: teamPlayers[j].lastName,
                    IGN: teamPlayers[j].IGN,
                    role: teamPlayers[j].role,
                })
            }

            if (temp.players.length == 0) temp.players = null;
        }
        else {
            temp["schoolID"] = teams[i].schoolID;
            temp["leagueID"] = teams[i].leagueID;
            temp["managerID"] = null; // TODO Add managers to database
            temp["coachID"] = null; // TODO Add coaches to database
            temp["playerIDs"] = [];

            let teamPlayers = players.filter(p => p.teamID == teams[i].ID);
            for (var j in teamPlayers) temp.playerIDs.push(teamPlayers[j].id);

            if (temp.playerIDs.length == 0) temp.players = null;
        }

        res.push(temp)
    }

    return res;
}

exports.getSchools = async (allinfo = false) => {
    let res = [];

    let teams = await DB.getTeams();
    let schools = await DB.getSchools();
    let leagues = await DB.getLeagues();
    let players = await DB.getPlayers();

    for (var i in schools) {
        let temp = {
            id: schools[i].ID,
            name: schools[i].name,
            teamName: schools[i].teamName,
            abbrev: schools[i].abbrev,
            logo: schools[i].logo,
            socials: {
                instagram: schools[i].igURL,
                twitter: schools[i].twitterURL,
                twitch: schools[i].twitchURL,
            }
        }

        if (allinfo) {
            temp["teams"] = [];
            let schoolTeams = teams.filter(t => t.schoolID == schools[i].ID);
            for (var j in schoolTeams) temp["teams"].push({
                id: teams.filter(t => t.ID == schoolTeams[j].ID)[0].ID,
                league: leagues.filter(l => l.ID == schoolTeams[j].leagueID)[0].title,
                manager: null,
                coach: null,
                players: null,
            });
            if (temp["teams"].length == 0) temp["teams"] = null;
        }
        else {
            temp["teamIDs"] = [];
            let schoolTeams = teams.filter(t => t.schoolID == schools[i].ID);
            for (var j in schoolTeams) temp["teamIDs"].push(schoolTeams[j].ID);
            if (temp["teamIDs"].length == 0) temp["teamIDs"] = null;
        }

        res.push(temp)
    }
    
    return res;
}

exports.getLeagues = async (allinfo = false) => {
    let res = [];

    let teams = await DB.getTeams();
    let schools = await DB.getSchools();
    let leagues = await DB.getLeagues();
    let players = await DB.getPlayers();

    for (var i in leagues) {
        let temp = {
            id: leagues[i].ID,
            name: leagues[i].title,
        }

        if (allinfo) {
            temp["teams"] = [];
            let schoolTeams = teams.filter(d => d.leagueID == leagues[i].ID);
            for (var j in schoolTeams) temp["teams"].push({
                id: teams.filter(d => d.ID == schoolTeams[j].ID)[0].ID,
                school: schools.filter(d => d.ID == schoolTeams[j].schoolID)[0].name,
                teamName: schools.filter(d => d.ID == schoolTeams[j].schoolID)[0].teamName,
                abbrev: schools.filter(d => d.ID == schoolTeams[j].schoolID)[0].abbrev,
                manager: null,
                coach: null,
                players: null,
            });
            if (temp["teams"].length == 0) temp["teams"] = null;
        }
        else {
            temp["teamIDs"] = [];
            let schoolTeams = teams.filter(d => d.leagueID == leagues[i].ID);
            for (var j in schoolTeams) temp["teamIDs"].push(schoolTeams[j].ID);
            if (temp["teamIDs"].length == 0) temp["teamIDs"] = null;
        }

        res.push(temp)
    }
    
    return res;
}

exports.getPlayers = async (allinfo = false) => {
    let res = [];

    let teams = await DB.getTeams();
    let schools = await DB.getSchools();
    let leagues = await DB.getLeagues();
    let players = await DB.getPlayers();

    for (var i in players) {
        let joinDate = new Date(Date.parse(players[i].joinDate));
        var leaveDate;

        if (players[i].leaveDate == null) leaveDate = null;
        else leaveDate = new Date(Date.parse(players[i].leaveDate)).toDateString();

        let temp = {
            id: players[i].id,
            firstName: players[i].firstName,
            lastName: players[i].lastName,
            IGN: players[i].IGN,
            accountID: players[i].accountID,
            role: players[i].role,
            type: players[i].type,
            joinDate: joinDate.toDateString(),
            leaveDate: leaveDate
        }

        if (allinfo) {
            let school = schools.filter(s => s.ID == teams.filter(t => t.ID == players[i].teamID)[0].schoolID)[0];
            temp["team"] = {
                id: players[i].teamID,
                school: school.name,
                teamName: school.teamName,
                abbrev: school.abbrev,
                manager: null,
                coach: null,
                players: null,
            };
        }
        else temp["teamID"] = players[i].teamID;

        res.push(temp)
    }
    
    return res;
}