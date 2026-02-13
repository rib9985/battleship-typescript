type positionTuple = [row: number, column: number]
type verticalPlace = boolean
type randomPosPlaceObject = { pos: positionTuple, verticalPlace: verticalPlace }

export default function getRandomPlace(): randomPosPlaceObject {
	const placeRow = Math.floor(Math.random() * 10);
	const placeColumn = Math.floor(Math.random() * 10);

	const verticalPlace: boolean = getRandomBool();
	const pos: positionTuple = [placeRow, placeColumn]

	return { pos, verticalPlace }

}

function getRandomBool(): boolean {
	const number = Math.random()
	return (number < 0.5 ? true : false);
}
