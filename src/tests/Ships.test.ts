import Ship from "../logic/Ships";

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

test("creates the correct ship object", () => {
	expect(cruiser).toEqual({
		shipClass: "cruiser",
		length: 2,
		hits: 0,
		sunk: false,
	});
});

test("one hit to work correctly", () => {
	cruiser.hit();
	expect(cruiser.hits).toEqual(1);
});

test("two hits to work correctly", () => {
	cruiser.hit();
	expect(cruiser.hits).toEqual(2);
});

test("ship was sunk", () => {
	expect(cruiser.sunk).toEqual(true);
});

test("more hits after sink to work correctly", () => {
	cruiser.hit();
	expect(cruiser.hits).toEqual(2);
	expect(cruiser.sunk).toEqual(true);
});
