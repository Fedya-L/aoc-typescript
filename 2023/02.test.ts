import { describe, expect, it } from "vitest";

import { Reader } from "../utils/data-reader";
import { solve1 } from "./02";



describe('2023 02', () => {

    const reader = new Reader(2023, 2)

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
})