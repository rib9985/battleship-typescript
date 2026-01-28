export default class Ship {
	shipClass: string
	length: number
	hits: number
	sunk: boolean

	constructor(shipClass: string, length: number, hits = 0, sunk = false) {
		this.length = length;
		this.shipClass = shipClass;
		this.hits = hits;
		this.sunk = sunk;
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

const carrier = new Ship("carrier", 4);
const battleship = new Ship("battleship", 3);
const cruiser = new Ship("cruiser", 2);
const submarine = new Ship("submarine", 1);

const fleet = [
	carrier,
	battleship,
	battleship,
	cruiser,
	cruiser,
	cruiser,
	submarine,
	submarine,
	submarine,
	submarine,
];
