import { Reader } from "../utils/data-reader";
import { solve1, solve2 } from "./06";



describe('2023 06', () => {

    const reader = new Reader(2023, 6)

    it('1 sample', () => {
        const input = reader.readSampleInput()
        const answer = reader.readSampleAnswer1()

        expect(solve1(input)).toBe(answer)
    })

    it('1 real', () => {
        const input = reader.readInput()
        const answer = reader.readAnswer1()

        expect(solve1(input)).toBe(answer)
    })

    it('2 sample', () => {
        const input = reader.readSampleInput()
        const answer = reader.readSampleAnswer2()

        expect(solve2(input)).toBe(answer)
    })


    it('2 real', () => {
        const input = reader.readInput()
        const answer = reader.readAnswer2()

        expect(solve2(input)).toBe(answer)
    })
})