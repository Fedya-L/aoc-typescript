import { Reader } from "../utils/data-reader";
import { Coordinate2D } from "../utils/data-things";
import { calculateArea, calculatePerimeter, calculatePolygonArea, solve1, solve2 } from "./18";



describe('2023 18', () => {

    const reader = new Reader(2023, 18)

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

    it('calculatePolygonArea', () => {
        const coordinates: Coordinate2D[] = [
            {x: 0, y: 0},
            {x: 2, y: 0},
            {x: 2, y: 1},
            {x: 3, y: 1},
            {x: 3, y: 2},
            {x: 0, y: 2},
        ];

        const area = calculatePolygonArea(coordinates)
        expect(area).toBe(5)
    })

    it('calculatePerimeter', () => {
        const coordinates: Coordinate2D[] = [
            {x: 0, y: 0},
            {x: 2, y: 0},
            {x: 2, y: 2},
            {x: 4, y: 2},
            {x: 4, y: 0},
            {x: 6, y: 0},
            {x: 6, y: 5},
            {x: 0, y: 5},
        ];

        const perimeter = calculatePerimeter(coordinates)
        expect(perimeter).toBe(26)
    })

    it('calculateArea 1', () => {

        const coordinates: Coordinate2D[] = [
            {x: 0, y: 0},
            {x: 2, y: 0},
            {x: 2, y: 1},
            {x: 3, y: 1},
            {x: 3, y: 2},
            {x: 0, y: 2},
        ];

        const area = calculateArea(coordinates)
        expect(area).toBe(11)
    })

    it('calculateArea 2', () => {

        const coordinates: Coordinate2D[] = [
            {x: 0, y: 0},
            {x: 2, y: 0},
            {x: 2, y: 2},
            {x: 4, y: 2},
            {x: 4, y: 0},
            {x: 6, y: 0},
            {x: 6, y: 5},
            {x: 0, y: 5},
        ];

        const area = calculateArea(coordinates)
        expect(area).toBe(40)
    })
})
