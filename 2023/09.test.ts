import { Reader } from "../utils/data-reader";
import { expendedSetToExpendedSetWithPredictions, historyEntryToExpendedSet, lineToHistoryEntry, solve1, solve2 } from "./09";

describe('2023 09', () => {

    const reader = new Reader(2023, 9)

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

    it('lineToHistoryEntry', () => {
        const input = '-4 0 207 -34'
        const expectedResult = [-4, 0, 207, -34]

        expect(lineToHistoryEntry(input)).toStrictEqual(expectedResult)
    })

    it('historyEntryToExpendedSet', () => {
        const input = [1, 3, 6, 10, 15, 21]
        const expectedResult = [
            [1, 3, 6, 10, 15, 21],
            [2, 3, 4,  5,  6],
            [1, 1, 1,  1],
            [0, 0, 0]
        ]

        expect(historyEntryToExpendedSet(input)).toStrictEqual(expectedResult)
    })

    it('expendedSetToExpendedSetWithPredictions', () => {
        const input = [
            [1, 3, 6, 10, 15, 21],
            [2, 3, 4,  5,  6],
            [1, 1, 1,  1],
            [0, 0, 0]
        ]
        const expectedResult = [
            [0, 1, 3, 6, 10, 15, 21, 28],
            [1, 2, 3, 4,  5,  6,  7],
            [1, 1, 1, 1,  1,  1],
            [0, 0, 0, 0, 0]
        ]

        expect(expendedSetToExpendedSetWithPredictions(input)).toStrictEqual(expectedResult)
    })
})