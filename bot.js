class Bot {
    constructor(i) {
        this.playerIndex = i;
    }

    getDraft(territories) {
        let myTerritories = territories.filter(territory => territory.playerIndex === this.playerIndex);
        let numberOfTroopsToDraft = Math.round(3 + (myTerritories.length - (Math.floor(territories.length / 3))) / 2) // should be done "server side" but nah

        let myTerritoryToDraftOn = myTerritories[Math.floor(Math.random() * myTerritories.length)];
        let totalTerritoriesIndex = undefined; // not the index of its territories but all territories

        // gets the index
        for (let i = 0; i < territories.length; i++) {
            if (myTerritoryToDraftOn == territories[i]) {
                totalTerritoriesIndex = i;
            }
        }

        return [{
            territoryIndex: totalTerritoriesIndex,
            troops: numberOfTroopsToDraft
        }];
    }

    getAttack(territories) {
        // Filter territories to attack with, excluding those with less than 2 troops
        let myTerritoriesToAttackWith = territories.filter(t => t.playerIndex === this.playerIndex && t.numberOfTroops > 2);

        myTerritoriesToAttackWith = shuffleArray(myTerritoriesToAttackWith);

        let attackingTerritory = undefined;
        let enemyNeighbours = undefined;
        let foundGoodOne = false;

        for (let i = 0; i < myTerritoriesToAttackWith.length; i++) {
            if (!foundGoodOne) {
                attackingTerritory = myTerritoriesToAttackWith[i];
                enemyNeighbours = attackingTerritory.connectedTerritoriesIndexes.filter(index => territories[index].playerIndex !== this.playerIndex);

                // first one that neighbours something, use it
                if (enemyNeighbours.length > 0) {
                    foundGoodOne = true;
                    break;
                }
            }
        }

        if (!foundGoodOne) return null; // no attack possible

        // attack random neighbour
        let targetIndex = enemyNeighbours[Math.floor(Math.random() * enemyNeighbours.length)];
        return {
            fromTerritoryIndex: territories.findIndex(t => t === attackingTerritory),
            toTerritoryIndex: targetIndex,
            troops: Math.min(attackingTerritory.numberOfTroops - 1, Math.floor(Math.random() * attackingTerritory.numberOfTroops)) // Attack with up to all available troops, but keep 1 behind
        };
    }

}

// add path calculations