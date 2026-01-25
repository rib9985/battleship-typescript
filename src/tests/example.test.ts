import { add } from './example'


test('the 8 returns correctly', () => {
	expect(add(0, 0)).toStrictEqual(0)
})

test('4+4 returns correctly', () => {
	expect(add(4, 4)).toStrictEqual(8)
})

