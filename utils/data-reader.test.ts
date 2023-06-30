import { describe, expect, it } from "vitest";
import { readAnswer, readInput } from "./data-reader";

describe('data-reader', () => {

    it('test readInput', () => {
    const expected = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`

    expect(readInput(2022, 1, 1, true)).toEqual(expected)
    })

    it('test readAnswer', () => {
        const expected = 24000

        expect(readAnswer(2022, 1, 1, true))
    })
})
