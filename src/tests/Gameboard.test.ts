import { Fleet } from "../logic/Ships";
import Gameboard from "../logic/Gameboard";

describe('Gameboard tests', () => {
	const fleet = new Fleet().ships
	const gameboard = new Gameboard()

	describe('Placing ships works correctly', () => {
		test("Placing carrier", () => {
			expect(gameboard.placeShip('carrier', [0, 0])).toEqual(true)
		})
		test("Placing submarine", () => {
			expect(gameboard.placeShip('submarineOne', [1, 0])).toEqual(true)
			expect(gameboard.availableShips.has('submarineOne')).toEqual(false)
			expect(gameboard.placedShips.has('submarineOne')).toEqual(true)
		})

		test("Cruiser cannot be placed, remains in the available ship", () => {
			expect(gameboard.placeShip('cruiserOne', [1, 0])).toEqual(false)
			expect(gameboard.availableShips.has('cruiserOne')).toEqual(true)
			expect(gameboard.placedShips.has('cruiserOne')).toEqual(false)
		})

		test("Placing cruiser, now possible ", () => {
			expect(gameboard.placeShip('cruiserOne', [3, 0])).toEqual(true)
			expect(gameboard.availableShips.has('cruiserOne')).toEqual(false)
			expect(gameboard.placedShips.has('cruiserOne')).toEqual(true)
		});
	})

	describe('Receiving attacks works correctly', () => {
		const gameboardWithShips = new Gameboard()

		gameboardWithShips.placeShip('carrier', [0, 0])
		gameboardWithShips.placeShip('cruiserOne', [1, 0])
		gameboardWithShips.placeShip('submarineOne', [2, 0])

		test("Attacking carrier returns true", () => {
			expect(gameboardWithShips.receiveAttack([0, 0])).toEqual(true)
		});
		test("Carrier has one hit", () => {
			expect(gameboardWithShips.placedShips.get('carrier')?.hits).toEqual(1)
		});
		test("Board has been marked as 1", () => {
			expect(gameboardWithShips.board[0][0]).toEqual(2)
		});
	})

});




