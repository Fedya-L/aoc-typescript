import { Reader } from "../utils/data-reader";
import { diffCoordinates, pipeProcessors, solve1, solve2 } from "./10";

describe('2023 10', () => {

    const reader = new Reader(2023, 10)

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
        const input = reader.readSampleInput2()
        const answer = reader.readSampleAnswer2()

        expect(solve2(input)).toBe(answer)
    })


    it('2 real', () => {
        const input = reader.readInput()
        const answer = reader.readAnswer2()

        expect(solve2(input)).toBe(answer)
    })

    it('diffCoordinates', () => {
        const a = {x: 10, y: 100}
            const b = {x: 5, y: 47}

        const expectedResult = {x: -5, y: -53}

        expect(diffCoordinates(a,b)).toStrictEqual(expectedResult)
    })

    it('PipeProcessor passThrough | success', () => {
        const processor = pipeProcessors['|']

        const entryCoordiate = {x: 10, y: 99}
        const pipeCoordiate = {x: 10, y: 100}
        const expectedExitCoordiate = {x: 10, y: 101}

        const exitCoordinate = processor.passTrough(pipeCoordiate, entryCoordiate)

        expect(exitCoordinate).toStrictEqual(expectedExitCoordiate)
    })

    it('PipeProcessor passThrough | fail', () => {
        const processor = pipeProcessors['|']

        const entryCoordiate = {x: 9, y: 100}
        const pipeCoordiate = {x: 10, y: 100}
        const expectedExitCoordiate = undefined

        const exitCoordinate = processor.passTrough(pipeCoordiate, entryCoordiate)

        expect(exitCoordinate).toStrictEqual(expectedExitCoordiate)
    })
})