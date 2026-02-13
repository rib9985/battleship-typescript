import getRandomPlace from "./helpers"
import { Ship, Fleet } from "./Ships"
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
		this.availableShips = this.generateFleet();
		this.placedShips = new Map()
		this.sunkShips = new Map()

		this._originalFleet = this.generateFleet()
	}

	private generateBoardArray(boardSize: boardSizeTuple) {
		const rows = boardSize[0]
		const columns = boardSize[1]

		return Array.from({ length: rows }, () => new Array(columns).fill(0));
	}

	//Total of 10 ships
	private generateFleet(): shipMap {
		const fleet = new Fleet()
		return fleet.ships
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

	placeShip(ship: string, position: positionTuple): true | false {
		try {
			const shipToPlace = this.getShip(ship, this.availableShips)
			const shipIsShip = shipToPlace instanceof Ship

			if (shipIsShip && this.checkIfPlaceIsValid(shipToPlace, position)) {
				this.transferShip(ship, this.availableShips, this.placedShips)
				this.updateBoardWithShip(shipToPlace, position)
				return true
			}
			return false

		} catch (error) {
			console.error(error)
			return false
		}
	}

	private checkIfPlaceIsValid(ship: Ship, position: positionTuple): true | false {
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

	private checkIfShipInBounds(ship: Ship, position: positionTuple): true | false {
		const row = position[0]
		const column = position[1]

		const shipLen = ship.length;

		const finalRow = this.isVerticalPlace ? row + shipLen : row;
		const finalColumn = this.isVerticalPlace ? column : column + shipLen;

		return (finalRow <= this.boardSize[0] && finalColumn <= this.boardSize[1]) ? true : false
	}

	private checkSpacesNotOccupied(ship: Ship, position: positionTuple): boolean {
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

	private updateBoardWithShip(ship: Ship, position: positionTuple): void {
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
		this.availableShips = this.generateFleet();
		this.placedShips = new Map()
		this.sunkShips = new Map()
	}

	checkFleetPlace(): boolean {
		if (this.placedShips.size !== this._originalFleet.size) {
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
	}

	receiveAttack(position: positionTuple): boolean | null {
		const hitCheck = this.checkForHit(position);

		if (hitCheck === false) {
			this.markPosition(position);
			return false;
		}
		else if (typeof hitCheck === "object" && hitCheck instanceof Ship) {
			this.shipWasHit(hitCheck);
			this.markHit(position);
			return true;
		}
		return null
	}

	private checkForHit(position: positionTuple): null | false | Ship {
		const row = position[0]
		const column = position[1]
		const boardPosToCheck = this.board[row][column]

		if (typeof boardPosToCheck === "object" && boardPosToCheck instanceof Ship) {
			return boardPosToCheck;
		}
		else if (boardPosToCheck === 0) {
			return false;
		}
		return null
	}


	private markPosition(position: positionTuple) {
		this.board[position[0]][position[1]] = 1;
	}

	private markHit(position: positionTuple) {
		this.board[position[0]][position[1]] = 2;
	}

	private shipWasHit(ship: Ship) {
		ship.hit();
		const shipWasSunk = this.checkShipWasSunk(ship)

		if (shipWasSunk) {
			this.checkIfAllSunk()
		};
	}

	private checkShipWasSunk(ship: Ship): boolean {
		if (ship.isSunk()) {
			this.transferShip(ship.shipClass, this.placedShips, this.sunkShips);
			return true
		}
		return false
	}

	private checkIfAllSunk(): boolean {
		if (this.sunkShips.size !== this._originalFleet.size) {
			return false
		}

		else {
			const originalFleetKeys = this._originalFleet.keys()
			for (const key in originalFleetKeys) {
				if (this.sunkShips.has(key) === false) {
					return false
				}
			}
			return true
		}
	}

	placeShipsRandom() {
		const ships = this.availableShips
		ships.forEach((ship) => {
			let placed = false;
			while (!placed) {
				let randomCoords = getRandomPlace();
				let position = randomCoords.pos
				let vertical = randomCoords.verticalPlace;
				this.isVerticalPlace = vertical;

				placed = this.placeShip(ship.shipClass, position);
			}
		});
	}

}
