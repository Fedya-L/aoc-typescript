import { readFileSync, readSync } from "fs"

export function readInput(year: number, day: number, sample: boolean): string {
    const path = `inputs-and-answers/${year}/${day.toString().padStart(2, '0')}/${sample ? 'sample_' : ''}input.txt`
    return readFileSync(path).toString().trimEnd()
}

export function readAnswer(year: number, day: number, task: number, sample: boolean): number {
    const path = `inputs-and-answers/${year}/${day.toString().padStart(2, '0')}/${sample ? 'sample_' : ''}answer_${task}.txt`
    return parseInt(readFileSync(path).toString().trimEnd())
}

class Reader {
    year: number
    day: number

    private folderPath: string

    constructor(year: number, day: number) {
        this.year = year
        this.day = day

        this.folderPath = `inputs-and-answers/${year}/${day.toString().padStart(2, '0')}/`
    }

    readInput(): string {
        const filePath = `${this.folderPath}input.txt`
        return readFileSync(filePath).toString().trimEnd()
    }

    readAnswer1(): number {
        const filePath = `${this.folderPath}answer_1.txt`
        return parseInt(readFileSync(filePath).toString().trimEnd())
    }

    readAnswer2(): number {
        const filePath = `${this.folderPath}answer_2.txt`
        return parseInt(readFileSync(filePath).toString().trimEnd())
    }

    readSampleInput(): string {
        const filePath = `${this.folderPath}sample_input.txt`
        return readFileSync(filePath).toString().trimEnd()
    }

    readSampleInput2(): string {
        const filePath = `${this.folderPath}sample_input_2.txt`
        return readFileSync(filePath).toString().trimEnd()
    }

    readSampleAnswer1(): number {
        const filePath = `${this.folderPath}sample_answer_1.txt`
        return parseInt(readFileSync(filePath).toString().trimEnd())
    }

    readSampleAnswer2(): number {
        const filePath = `${this.folderPath}sample_answer_2.txt`
        return parseInt(readFileSync(filePath).toString().trimEnd())
    }
}

class ReaderV2 {

    private _answers: {
        sample1: number
        sample2: number
        real1: number
        real2: number
    }

    private folderPath: string

    constructor(year: number, day: number) {
        this.folderPath = `inputs-and-answers/${year}/${day.toString().padStart(2, '0')}/`

        const inputFilePath = this.folderPath + 'answers.json'
        const rawAnswers = readFileSync(inputFilePath).toString()
        this._answers = JSON.parse(rawAnswers)
    }

    get sampleAnswer1(): number {
        return this._answers.sample1
    }

    get sampleAnswer2(): number {
        return this._answers.sample2
    }

    get realAnswer1(): number {
        return this._answers.real1
    }

    get realAnswer2(): number {
        return this._answers.real2
    }

    readSampleInput(): string {
        const filePath = `${this.folderPath}sample_input.txt`
        return readFileSync(filePath).toString().trimEnd()
    }

    readRealInput(): string {
        const filePath = `${this.folderPath}input.txt`
        return readFileSync(filePath).toString().trimEnd()
    }

}

export { Reader, ReaderV2 }
