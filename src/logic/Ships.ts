type shipClass = string
type length = number
type hits = number
type sunk = boolean
type shipMap = Map<string, Ship>

export class Ship {
	shipClass: shipClass
	length: length
	hits: hits
	sunk: sunk

	constructor(shipClass: string, length: number, hits = 0) {
		this.length = length;
		this.shipClass = shipClass;
		this.hits = hits;
		this.sunk = this.isSunk();
	}

	isSunk(): boolean {
		if (this.length === this.hits) {
			this.sunk = true;
			return true;
		} else {
			return false;
		}
	}

	hit() {
		if (this.isSunk()) {
			return;
		} else {
			this.hits += 1;
			this.isSunk();
		}
	}
}

export class Fleet {
	ships: shipMap

	constructor() {
		this.ships = this.createFleet()
	}

	private createFleet(): shipMap {
		const carrier = new Ship("carrier", 4);
		const battleshipOne = new Ship("battleshipOne", 3);
		const battleshipTwo = new Ship("battleshipTwo", 3);
		const cruiserOne = new Ship("cruiserOne", 2);
		const cruiserTwo = new Ship("cruiserTwo", 2);
		const cruiserThree = new Ship("cruiserThree", 2);
		const submarineOne = new Ship("submarineOne", 1);
		const submarineTwo = new Ship("submarineTwo", 1);
		const submarineThree = new Ship("submarineThree", 1);
		const submarineFour = new Ship("submarineFour", 1);

		const fleetArr = [
			carrier,
			battleshipOne,
			battleshipTwo,
			cruiserOne,
			cruiserTwo,
			cruiserThree,
			submarineOne,
			submarineTwo,
			submarineThree,
			submarineFour,
		];
		const fleetMap = new Map()
		fleetArr.forEach(element => fleetMap.set(element.shipClass, element))
		return fleetMap;
	}

	returnShip(shipClass: string): Ship | null {
		const ship = this.ships.get(shipClass)
		return ship ? ship : null
	}

}
