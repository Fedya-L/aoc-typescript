import { Reader } from "../utils/data-reader";
import { solve1, solve1v2, solve2 } from "./21";



describe('2023 21', () => {

    const reader = new Reader(2023, 21)

    it('1 sample', () => {
        const input = reader.readSampleInput()
        const answer = reader.readSampleAnswer1()

        expect(solve1(input, 6)).toBe(answer)
    })

    it('1 real', () => {
        const input = reader.readInput()
        const answer = reader.readAnswer1()

        expect(solve1(input, 64)).toBe(answer)
    })
    it('1 v2 sample', () => {
        const input = reader.readSampleInput()
        const answer = reader.readSampleAnswer1()

        expect(solve1v2(input, 6)).toBe(answer)
    })

    it('1 v2 real', () => {
        const input = reader.readInput()
        const answer = reader.readAnswer1()

        expect(solve1v2(input, 64)).toBe(answer)
    })

    it('2 real', () => {
        const input = reader.readInput()
        const answer = reader.readAnswer2()

        expect(solve2(input, 26501365)).toBe(answer)
    })
})
