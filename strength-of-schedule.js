// ==UserScript==
// @name       My Fancy New Userscript
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://rcssc.rivercitysignup.com/standings/standings.php*
// @copyright  2015+, You
// ==/UserScript==

// define Team object
function Team(teamId, points, wins, losses, ties) {
    this.teamId = teamId;
    
    this.points = parseInt(points);
    this.wins = parseInt(wins);
    this.losses = parseInt(losses);
    this.ties = parseInt(ties);
    
    this.pastSosPoints = 0;
    this.pastSosWins = 0;
    this.pastSosLosses = 0;
    this.pastSosTies = 0;
    
    this.futureSosPoints = 0;
    this.futureSosWins = 0;
    this.futureSosLosses = 0;
    this.futureSosTies = 0;
    
    this.pastSosRank = parseInt(teamId);
    this.futureSosRank = parseInt(teamId);
    this.overallSosRank = parseInt(teamId);
}

Team.prototype.getPoints = function() {
    return this.points;
};

Team.prototype.getWins = function() {
    return this.wins;
};

Team.prototype.getLosses = function() {
    return this.losses;
};

Team.prototype.getTies = function() {
    return this.ties;
};

Team.prototype.addPastOppRecord = function(oppPoints, oppWins, oppLosses, oppTies) {
    this.pastSosPoints += parseInt(oppPoints);
    this.pastSosWins += parseInt(oppWins);
    this.pastSosLosses += parseInt(oppLosses);
    this.pastSosTies += parseInt(oppTies);
};

Team.prototype.addFutureOppRecord = function(oppPoints, oppWins, oppLosses, oppTies) {
    this.futureSosPoints += parseInt(oppPoints);
    this.futureSosWins += parseInt(oppWins);
    this.futureSosLosses += parseInt(oppLosses);
    this.futureSosTies += parseInt(oppTies);
};

Team.prototype.getPastSos = function() {  
    return this.pastSosWins + '—' + this.pastSosLosses + '—' + this.pastSosTies;
};

Team.prototype.getFutureSos = function() {  
    return this.futureSosWins + '—' + this.futureSosLosses + '—' + this.futureSosTies;
};

Team.prototype.getOverallSos = function() {  
    return (this.pastSosWins + this.futureSosWins) + '—' + (this.pastSosLosses + this.futureSosLosses) + '—' + (this.pastSosTies + this.futureSosTies);
};

Team.prototype.getPastSosPoints = function() {
    return this.pastSosPoints;
};

Team.prototype.getFutureSosPoints = function() {
    return this.futureSosPoints;
};

Team.prototype.getOverallSosPoints = function() {
    return this.overallSosPoints;
};

Team.prototype.getPastSosRank = function() {
    return this.pastSosRank;
};

Team.prototype.getFutureSosRank = function() {
    return this.futureSosRank;
};

Team.prototype.getOverallSosRank = function() {
    return this.overallSosRank;
};

Team.prototype.setPastSosRank = function(pastSosRank) {
    this.pastSosRank = parseInt(pastSosRank);
};

Team.prototype.setFutureSosRank = function(futureSosRank) {
    this.futureSosRank = parseInt(futureSosRank);
};

Team.prototype.setOverallSosRank = function(overallSosRank) {
    this.overallSosRank = parseInt(overallSosRank);
};
// end define Team object

var teams = [];

var tables = document.getElementsByClassName("standingstable");

// pull all the current team records into memory
for (var r = 1; r < tables[0].rows.length; r++) {
    var teamId = tables[0].rows[r].cells[0].innerHTML;
    var record = tables[0].rows[r].cells[4].innerHTML.split('—');
    var points = tables[0].rows[r].cells[5].innerHTML;
    
    teams[teamId] = new Team(teamId, points, record[0], record[1], record[2]);
}

// get past SOS
for (var r = 1; r < tables[1].rows.length; r++) {
    var team1 = teams[tables[1].rows[r].cells[4].innerHTML.substr(1, 2).replace(/^0/,'')];
    var team2 = teams[tables[1].rows[r].cells[5].innerHTML.substr(1, 2).replace(/^0/,'')];
    
    team1.addPastOppRecord(team2.getPoints(), team2.getWins(), team2.getLosses(), team2.getTies());
    team2.addPastOppRecord(team1.getPoints(), team1.getWins(), team1.getLosses(), team1.getTies());
}

// get future SOS
for (var r = 1; r < tables[2].rows.length; r++) {
    var team1 = teams[tables[2].rows[r].cells[4].innerHTML.substr(1, 2).replace(/^0/,'')];
    var team2 = teams[tables[2].rows[r].cells[5].innerHTML.substr(1, 2).replace(/^0/,'')];
    
    team1.addFutureOppRecord(team2.getPoints(), team2.getWins(), team2.getLosses(), team2.getTies());
    team2.addFutureOppRecord(team1.getPoints(), team1.getWins(), team1.getLosses(), team1.getTies());
}

// determine rankings
for (var a = 1; a < teams.length; a++) {
    for (var b = 1; b < teams.length; b++) {
        if ((teams[a].getPastSosPoints() > teams[b].getPastSosPoints() && teams[a].getPastSosRank() > teams[b].getPastSosRank()) || 
           (teams[a].getPastSosPoints() == teams[b].getPastSosPoints() && teams[a].getPoints() > teams[b].getPoints() && teams[a].getPastSosRank() > teams[b].getPastSosRank())) {
            teams[a].setPastSosRank(teams[a].getPastSosRank() + teams[b].getPastSosRank());
            teams[b].setPastSosRank(teams[a].getPastSosRank() - teams[b].getPastSosRank());
            teams[a].setPastSosRank(teams[a].getPastSosRank() - teams[b].getPastSosRank());
        }
        
        if ((teams[a].getFutureSosPoints() > teams[b].getFutureSosPoints() && teams[a].getFutureSosRank() > teams[b].getFutureSosRank()) || 
           (teams[a].getFutureSosPoints() == teams[b].getFutureSosPoints() && teams[a].getPoints() > teams[b].getPoints() && teams[a].getFutureSosRank() > teams[b].getFutureSosRank())) {
            teams[a].setFutureSosRank(teams[a].getFutureSosRank() + teams[b].getFutureSosRank());
            teams[b].setFutureSosRank(teams[a].getFutureSosRank() - teams[b].getFutureSosRank());
            teams[a].setFutureSosRank(teams[a].getFutureSosRank() - teams[b].getFutureSosRank());
        }
        
        if ((teams[a].getOverallSosPoints() > teams[b].getOverallSosPoints() && teams[a].getOverallSosRank() > teams[b].getOverallSosRank()) || 
           (teams[a].getOverallSosPoints() == teams[b].getOverallSosPoints() && teams[a].getPoints() > teams[b].getPoints() && teams[a].getOverallSosRank() > teams[b].getOverallSosRank())) {
            teams[a].setOverallSosRank(teams[a].getOverallSosRank() + teams[b].getOverallSosRank());
            teams[b].setOverallSosRank(teams[a].getOverallSosRank() - teams[b].getOverallSosRank());
            teams[a].setOverallSosRank(teams[a].getOverallSosRank() - teams[b].getOverallSosRank());
        }
    }
}

var th = document.createElement('th');
th.innerHTML = 'Past SoS';
tables[0].rows[0].appendChild(th);

th = document.createElement('th');
th.innerHTML = 'Future SoS';
tables[0].rows[0].appendChild(th);

th = document.createElement('th');
th.innerHTML = 'Overall SoS';
tables[0].rows[0].appendChild(th);

//populate SoS values
for (var r = 1; r < tables[0].rows.length; r++) {
    var teamId = tables[0].rows[r].cells[0].innerHTML;
    
    var cell = tables[0].rows[r].insertCell(-1);
    cell.innerHTML = teams[teamId].getPastSos() + ' <strong>(#' + teams[teamId].getPastSosRank() + ')</strong>';
    
    cell = tables[0].rows[r].insertCell(-1);
	cell.innerHTML = teams[teamId].getFutureSos() + ' <strong>(#' + teams[teamId].getFutureSosRank() + ')</strong>';
    
    cell = tables[0].rows[r].insertCell(-1);
	cell.innerHTML = teams[teamId].getOverallSos() + ' <strong>(#' + teams[teamId].getOverallSosRank() + ')</strong>';
}
