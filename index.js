let numberOfPlayers = 2;

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

let territories = [];

// adds random no 5 to 20
for (let i = 0; i < Math.floor(Math.random() * (30 - 10 + 1)) + 10; i++) {
    territories.push({ numberOfConnections: Math.floor(Math.random() * (5)) + 1, connectedTerritoriesIndexes: [], coords: { x: 0, y: 0 }, numberOfTroops: 0, playerIndex: 0 });
}

let oldestEmptyTerritoryIndex = 0;

for (let i = 0; i < territories.length; i++) {
    if (i == 0) {
        territories[i].coords.x = c.width / 2;
        territories[i].coords.y = c.height / 2;
        oldestEmptyTerritoryIndex = i;
    } else {
        // connect it to the oldest open empty territory and connect that territory to it
        territories[i].connectedTerritoriesIndexes.push(oldestEmptyTerritoryIndex);
        territories[oldestEmptyTerritoryIndex].connectedTerritoriesIndexes.push(i);

        // if that territory you just connected to is full, we can create the x and ys and change the oldest territory to the second oldest one
        if (territories[oldestEmptyTerritoryIndex].numberOfConnections === territories[oldestEmptyTerritoryIndex].connectedTerritoriesIndexes.length) {
            let separatingAngle = 360 / territories[oldestEmptyTerritoryIndex].connectedTerritoriesIndexes.length;

            for (let z = 0; z < territories[oldestEmptyTerritoryIndex].connectedTerritoriesIndexes.length; z++) {
                let angle = separatingAngle * z;
                let changeInX = Math.cos(angle * Math.PI / 180) * 100;
                let changeInY = Math.sin(angle * Math.PI / 180) * 100;

                territories[territories[oldestEmptyTerritoryIndex].connectedTerritoriesIndexes[z]].coords.x = territories[oldestEmptyTerritoryIndex].coords.x + changeInX;
                territories[territories[oldestEmptyTerritoryIndex].connectedTerritoriesIndexes[z]].coords.y = territories[oldestEmptyTerritoryIndex].coords.y + changeInY;
            }

            let nextOldestEmptyIndex = -1;
            for (let p = oldestEmptyTerritoryIndex + 1; p < territories.length; p++) {
                if (territories[p].numberOfConnections > territories[p].connectedTerritoriesIndexes.length) {
                    nextOldestEmptyIndex = p;
                    break;
                }
            }
            oldestEmptyTerritoryIndex = nextOldestEmptyIndex;
        }
    }
}

// chat gpt made this and it's pretty cool (make it into a grid after all that haha)
let gridSpacing = 150;
let numRows = Math.ceil(Math.sqrt(territories.length));
let numCols = numRows;

for (let i = 0; i < territories.length; i++) {
    let row = Math.floor(i / numCols);
    let col = i % numCols;
    territories[i].coords.x = (col + 1) * gridSpacing;
    territories[i].coords.y = (row + 1) * gridSpacing;
}

let game = new Game(numberOfPlayers, territories);

game.start();