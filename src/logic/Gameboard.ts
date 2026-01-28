import Ship from "./Ships"
type boardSizeTuple = [rows: number, columns: number]
type positionTuple = [row: number, column: number]
type shipMap = Map<string, Ship>


export default class Gameboard {
	boardSize: boardSizeTuple
	board: number[][] | Ship[][]
	isVerticalPlace: boolean
	availableShips: shipMap
	placedShips: shipMap
	sunkShips: shipMap
	_originalFleet: shipMap

	constructor(rows = 10, columns = 10, isVertical = false) {
		this.boardSize = [rows, columns];
		this.board = this.generateBoardArray(this.boardSize);
		this.isVerticalPlace = isVertical;
		this.availableShips = this.shipFleet();
		this.placedShips = new Map()
		this.sunkShips = new Map()

		this._originalFleet = this.shipFleet()
	}

	generateBoardArray(boardSize: boardSizeTuple) {
		const rows = boardSize[0]
		const columns = boardSize[1]

		return Array.from({ length: rows }, () => new Array(columns).fill(0));
	}

	//Total of 10 ships
	private shipFleet(): shipMap {
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

	private getShip(shipName: string, map: shipMap): Ship | Error {
		const ship = map.get(shipName)
		if (ship instanceof Ship && shipName === ship.shipClass) {
			return ship
		}
		else {
			return new Error(`No Ship found within ${map}`);
		}
	}

	// TODO: think about error handling in the catch, should it exist? Maybe we just pass on undefined or false since we don't want to throw errors
	private transferShip(shipName: string, previousMap: shipMap, nextMap: shipMap) {
		try {
			const ship = this.getShip(shipName, previousMap)
			if (ship instanceof Ship && shipName === ship.shipClass) {
				nextMap.set(ship.shipClass, ship)
				previousMap.delete(ship.shipClass)
			}
		} catch (error) {
			console.error(error)
		}

	}

	placeShip(ship: string, position: positionTuple) {
		try {
			const shipToPlace = this.getShip(ship, this.availableShips)
			const shipIsShip = shipToPlace instanceof Ship

			if (shipIsShip &&
				this.checkIfPlaceIsValid(shipToPlace, position)) {
				this.transferShip(ship, this.availableShips, this.placedShips)
				this.updateBoardWithShip(shipToPlace, position)
			}

		} catch (error) {
			console.error(error)
		}

	}

	checkIfPlaceIsValid(ship: Ship, position: positionTuple): true | false {
		const row = position[0]
		const column = position[1]

		if (row > 9 || column > 9 || column < 0 || row < 0) {
			return false
		}

		if (this.board[row][column] === 0) {
			if (this.checkIfShipInBounds(ship, position) && this.checkSpacesNotOccupied(ship, position)) {
				return true
			}
			else {
				return false
			}

		}
		else {
			return false
		}
	}

	checkIfShipInBounds(ship: Ship, position: positionTuple): true | false {
		const row = position[0]
		const column = position[1]

		const shipLen = ship.length;

		const finalRow = this.isVerticalPlace ? row + shipLen : row;
		const finalColumn = this.isVerticalPlace ? column : column + shipLen;

		return (finalRow <= this.boardSize[0] && finalColumn <= this.boardSize[1]) ? true : false
	}

	checkSpacesNotOccupied(ship: Ship, position: positionTuple): boolean {
		const row = position[0]
		const column = position[1]
		const shipLen = ship.length;

		const rowIncrement = this.isVerticalPlace ? 1 : 0;
		const columnIncrement = this.isVerticalPlace ? 0 : 1;

		for (let i = 0; i < shipLen; i++) {
			const checkRow = row + (i * rowIncrement)
			const checkColumn = column + (i * columnIncrement)
			const gameboardSquare = this.board[checkRow][checkColumn]
			if (gameboardSquare === 0) {
				continue
			}
			else {
				return false
			}
		}

		return true

	}

	updateBoardWithShip(ship: Ship, position: positionTuple): void {
		const row = position[0]
		const column = position[1]
		const shipLen = ship.length;

		const rowIncrement = this.isVerticalPlace ? 1 : 0;
		const columnIncrement = this.isVerticalPlace ? 0 : 1;

		for (let i = 0; i < shipLen; i++) {
			const rowCalc = row + (i * rowIncrement)
			const columnCalc = column + (i * columnIncrement)
			this.board[rowCalc][columnCalc] = ship
		}
	}

	resetBoard(): void {
		this.board = this.generateBoardArray(this.boardSize);
		this.availableShips = this.shipFleet();
		this.placedShips = new Map()
		this.sunkShips = new Map()
	}

	checkFleetPlace(): boolean {
		if (this.availableShips.size !== 0) {
			return false
		}

		else if (this.placedShips.size !== this._originalFleet.size) {
			return false
		}

		else {
			const originalFleetKeys = this._originalFleet.keys()
			for (const key in originalFleetKeys) {
				if (this.placedShips.has(key) === false) {
					return false
				}
			}
			return true
		}
		return true
	}

	// receiveAttack(row, column) {
	// 	const hitCheck = this.checkForHit(row, column);
	// 	if (hitCheck == false) {
	// 		this.markPosition(row, column);
	// 		return false;
	// 	}
	// 	if (typeof hitCheck == "object") {
	// 		this.shipWasHit(hitCheck);
	// 		this.markHit(row, column);
	// 		return true;
	// 	}
	// 	if (hitCheck == null) {
	// 		return null;
	// 	}
	// }
	//
	// shipWasHit(ship) {
	// 	ship.hit();
	// 	this.isShipSunk(ship);
	// }
	//
	// isShipSunk(ship) {
	// 	if (ship.isSunk()) {
	// 		this.moveToSunk(ship);
	// 	}
	// }
	//
	// moveToSunk(ship) {
	// 	const index = this.placedShips.findIndex(
	// 		(s) => s.shipClass === ship.shipClass,
	// 	);
	//
	// 	const sunk = this.placedShips.splice(index, 1);
	// 	this.sunkShips.push(...sunk);
	// }
	//
	// checkForHit(row, column) {
	// 	if (this.board[row][column] == 1) {
	// 		return null;
	// 	}
	// 	if (this.board[row][column] == 0) {
	// 		return false;
	// 	}
	// 	if (typeof this.board[row][column] == "object") {
	// 		const ship = this.board[row][column];
	// 		return ship;
	// 	}
	// }
	//
	// checkIfAllSunk() {
	// 	if (this.sunkShips.length == 10) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }
	//
	// markPosition(row, column) {
	// 	this.board[row][column] = 1;
	// }
	//
	// markHit(row, column) {
	// 	this.board[row][column] = 2;
	// }
	//
	// placeShipsRandom() {
	// 	const ships = [...this.availableShips];
	//
	// 	ships.forEach((ship) => {
	// 		let placed = false;
	//
	// 		while (!placed) {
	// 			let randomCoords = getRandomPlace();
	// 			let row = randomCoords.placeRow;
	// 			let column = randomCoords.placeColumn;
	// 			let vertical = randomCoords.verticalPlace;
	// 			this.isVerticalPlace = vertical;
	// 			placed = this.placeShip(ship, row, column);
	// 		}
	// 	});
	// }
	//
	// getShipPositions() {
	// 	return this.board.filter((item) => {
	// 		item instanceof Ship;
	// 	});
	// }
	//
	//
	//
}
