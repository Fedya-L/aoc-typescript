import { describe, expect, it } from "vitest";
import { solve1, solve2 } from "./01";
import { readAnswer, readInput } from "../utils/data-reader";

describe('2022 01', () => {
    it('1 sample', () => {
        const input = readInput(2022, 1, true)
        const answer = readAnswer(2022, 1,1, true)
        expect(solve1(input)).toBe(answer)
    })

    it('1', () => {
        const input = readInput(2022, 1, false)
        const answer = readAnswer(2022, 1,1, false)
        expect(solve1(input)).toBe(answer)
    })
    it('2 sample', () => {
        const input = readInput(2022, 1, true)
        const answer = readAnswer(2022, 1,2, true)
        expect(solve2(input)).toBe(answer)
    })

    it('2', () => {
        const input = readInput(2022, 1, false)
        const answer = readAnswer(2022, 1,2, false)
        expect(solve2(input)).toBe(answer)
    })
})