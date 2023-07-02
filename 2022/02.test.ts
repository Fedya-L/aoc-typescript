import { describe, it, expect } from "vitest";
import { readAnswer, readInput } from "../utils/data-reader";
import { solve1, solve2 } from "./02";

describe('2022 02', () => {
    it('1 sample', () => {
        const input = readInput(2022, 2, true)
        const answer = readAnswer(2022, 2, 1, true)
        expect(solve1(input)).toBe(answer)
    })

    it('1', () => {
        const input = readInput(2022, 2, false)
        const answer = readAnswer(2022, 2,1, false)
        expect(solve1(input)).toBe(answer)
    })
    it('2 sample', () => {
        const input = readInput(2022, 2, true)
        const answer = readAnswer(2022, 2, 2, true)
        expect(solve2(input)).toBe(answer)
    })

    it('2', () => {
        const input = readInput(2022, 2, false)
        const answer = readAnswer(2022, 2,2, false)
        expect(solve2(input)).toBe(answer)
    })
})