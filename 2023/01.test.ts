import { describe, expect, it } from "vitest";
import { fixTheInput, solve1, solve2, solve2FindFirstLast } from "./01";
import { Reader, readAnswer, readInput } from "../utils/data-reader";



describe('2023 01', () => {

    const reader = new Reader(2023, 1)

    it('1 sample', () => {
        const input = readInput(2023, 1, true)
        const answer = readAnswer(2023, 1,1, true)
        expect(solve1(input)).toBe(answer)
    })

    it('1', () => {
        const input = readInput(2023, 1, false)
        const answer = readAnswer(2023, 1,1, false)
        expect(solve1(input)).toBe(answer)
    })


    it('fix the input', () => {
        const input = 'onetwothreefourfivesixseveneightnine'
        const expectedOutput ='123456789'

        const output = fixTheInput(input)
        expect(output).toBe(expectedOutput)
    })

    it('2 sample', () => {
        const input = reader.readSampleInput2()
        const answer = readAnswer(2023, 1,2, true)
        expect(solve2FindFirstLast(input)).toBe(answer)
    })

    it('2 real', () => {
        const input = readInput(2023, 1, false)
        const answer = readAnswer(2023, 1,2, false)
        expect(solve2FindFirstLast(input)).toBe(answer)
    })

})
