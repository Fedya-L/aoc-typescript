import { ReaderV2 } from "../utils/data-reader";
import { solve1, solve2 } from "./23";



describe('2023 23', () => {

    const reader = new ReaderV2(2023, 23)

    it('1 sample', () => {
        const input = reader.readSampleInput()
        const answer = reader.sampleAnswer1

        expect(solve1(input)).toBe(answer)
    })

    it('1 real', () => {
        const input = reader.readRealInput()
        const answer = reader.realAnswer1

        expect(solve1(input)).toBe(answer)
    })

    it('2 sample', () => {
        const input = reader.readSampleInput()
        const answer = reader.sampleAnswer2

        expect(solve2(input)).toBe(answer)
    })


    it('2 real', () => {
        const input = reader.readRealInput()
        const answer = reader.realAnswer2

        expect(solve2(input)).toBe(answer)
    })
})
