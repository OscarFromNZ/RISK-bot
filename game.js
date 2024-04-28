class Game {
    constructor(numberOfPlayers, territories) {
        this.territories = territories;
        this.numberOfPlayers = numberOfPlayers;
        this.players = [];

        this.turn = 0;
    }

    async start() {
        this.initPlayers();
        this.initTroops();
        this.draw();
        this.setupEventListeners();
    }

    // nothing's really implemented for 1s not being able to attack but whatever
    // and no way to attack with x amount of troops either yet
    async gameLoop() {
        let player = this.players[this.turn % 2];

        let drafts = player.getDraft(this.territories); // array of the territory index for the drafts and the amount of troops drafted
        
        for (let draft of drafts) {
            this.territories[draft.territoryIndex].numberOfTroops += draft.troops;
        }

        let attack = player.getAttack(this.territories);

        let attackingTerritory = this.territories[attack.fromTerritoryIndex];
        let victimTerritory = this.territories[attack.toTerritoryIndex];

        if (attack) {
            console.log(`Player ${player.playerIndex} attacks from territory ${attack.fromTerritoryIndex} with ${this.territories[attack.fromTerritoryIndex].numberOfTroops} troops on it to territory ${attack.toTerritoryIndex} with ${attack.troops} troops.`);
            // for now let's say no luck just pure minus signs on each side
            let removedTroops = attackingTerritory.numberOfTroops - victimTerritory.numberOfTroops;
            // since you can hit things that are bigger than you
            if (removedTroops < 1) removedTroops === attackingTerritory.numberOfTroops;

            // change the numbers
            attackingTerritory.numberOfTroops -= removedTroops;
            victimTerritory.numberOfTroops -= removedTroops;

            // change the colours
            if (attackingTerritory.numberOfTroops < 1) {
                console.log('something went terribly wrong');
                this.territories[attack.fromTerritoryIndex].numberOfTroops = 1;
            }

            if (victimTerritory.numberOfTroops < 1) {
                victimTerritory.playerIndex = player.playerIndex;
            }
        }
    
        this.draw();

        this.turn++;
    }

    draw() {
        for (let i = 0; i < this.territories.length; i++) {
            if (this.territories[i]) {
                this.drawConnections(this.territories[i]);
                this.drawTerritory({ x: this.territories[i].coords.x, y: this.territories[i].coords.y }, this.territories[i].numberOfTroops, this.territories[i]);
            }
        }
    }

    async initPlayers() {
        for (let i = 0; i < this.numberOfPlayers; i++) {
            this.players.push(new Bot(i));
        }
    }

    initTroops() {
        let maxTroops = 3 * this.territories.length;
        let noFirstPlayerTroops = 0; // 0
        let noSecondPlayerTroops = 0; // 1

        this.territories= shuffleArray(this.territories);

        // claim
        for (let i = 0; i < this.territories.length; i++) {
            // this is super bad code
            // if the player index for 0 hasn't reached max troops, add
            if (noFirstPlayerTroops <= Math.floor(this.territories.length / 2)) {
                this.territories[i].playerIndex = 0;
                this.territories[i].numberOfTroops = 1;
                noFirstPlayerTroops++;
            } else if (noSecondPlayerTroops <= Math.floor(this.territories.length / 2)) {
                this.territories[i].playerIndex = 1;
                this.territories[i].numberOfTroops = 1;
                noSecondPlayerTroops++;
            }
        }

        // add
        while (noFirstPlayerTroops < maxTroops / 2) {
            // add troops to random territories
            let randomTerritoryIndex = Math.floor(Math.random() * (this.territories.length));
            let randomTerritory = this.territories[randomTerritoryIndex];

            if (randomTerritory.playerIndex == 0) {
                this.territories[randomTerritoryIndex].numberOfTroops++;
                noFirstPlayerTroops++; // total btw
            }
        }

        // bad code
        while (noSecondPlayerTroops < maxTroops / 2) {
            // add troops to random territories
            let randomTerritoryIndex = Math.floor(Math.random() * (this.territories.length));
            let randomTerritory = this.territories[randomTerritoryIndex];

            if (randomTerritory.playerIndex == 1) {
                this.territories[randomTerritoryIndex].numberOfTroops++;
                noSecondPlayerTroops++; // total btw
            }
        }

    }


    setupEventListeners() {
        document.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    onKeyDown = (e) => {
        console.log('Key pressed:', e.key);
        this.gameLoop();
    }

    drawTerritory(coords, number, territory) {
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, 40, 0, 2 * Math.PI);
        ctx.fillStyle = territory.playerIndex == 0 ? "purple" : "green";
        ctx.fill();

        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(number, coords.x, coords.y);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawConnections(territory) {
        territory.connectedTerritoriesIndexes.forEach(i => {
            if (this.territories[i]) {
                ctx.beginPath();
                ctx.moveTo(territory.coords.x, territory.coords.y);
                ctx.lineTo(this.territories[i].coords.x, this.territories[i].coords.y);
                ctx.strokeStyle = "black";
                ctx.stroke();
            }
        });
    }
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}