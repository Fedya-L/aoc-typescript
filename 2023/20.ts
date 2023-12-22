interface Module {
    id: string
    outputs: string[]

    processPulse(pulse: Pulse): Pulse[]
}

type Pulse = {
    source: string
    target: string
    value: boolean
}

class FlipFlop implements Module {
    state: boolean

    id: string
    outputs: string[]

    constructor(id: string, outputs: string[]) {
        this.id = id
        this.outputs = outputs
        this.state = false
    }

    processPulse(pulse: Pulse): Pulse[] {
        if (pulse.value) {
            return []
        }
        this.state = !this.state
        return this.outputs.map(o => ({source: this.id, target: o, value: this.state}))
    }
}

class Conjuction implements Module {
    id: string
    outputs: string[]
    inputsToLastPulse: Map<string, boolean>

    constructor(id: string, outputs: string[]) {
        this.id = id
        this.outputs = outputs
        this.inputsToLastPulse = new Map()
    }

    registerInputs(inputs: string[]) {
        inputs.forEach(i => this.inputsToLastPulse.set(i, false))
    }

    processPulse(pulse: Pulse): Pulse[] {
        this.inputsToLastPulse.set(pulse.source, pulse.value)

        let output = false
        for (const [,pulse] of this.inputsToLastPulse) {
            if (!pulse) {
                output = true
                break
            }
        }
        return this.outputs.map(o => ({source: this.id, target: o, value: output}))
    }
}

class Broadcaster implements Module {
    id: string
    outputs: string[]
    
    constructor(id: string, outputs: string[]) {
        this.id = id
        this.outputs = outputs
    }

    processPulse(pulse: Pulse): Pulse[] {
        return this.outputs.map(o => ({source: this.id, target: o, value: pulse.value}))
    }

}

function inputToModules(input: string): Map<string, Module> {

    const modules: Module[] = input.split("\n")
        .map(line => {
            const [rawId, rawOutputs] = line.split(' -> ')
            const outputs = rawOutputs.split(', ')

            const firstChar = rawId.charAt(0)
            switch (firstChar) {
                case '%': // Flip flop
                    return new FlipFlop(rawId.substring(1), outputs)
                case '&': // Conjuction
                    return new Conjuction(rawId.substring(1), outputs)
                default:
                    return new Broadcaster(rawId, outputs)
            }
        })

    let modulesMap = new Map<string, Module>()

    modules.forEach(m => modulesMap.set(m.id,m))

    for (const module of modules) {
        if ((module instanceof Conjuction) === false) {
            continue
        }
        const id = module.id
        const inputs = modules.filter(m => m.outputs.includes(id)).map(m => m.id)
        module.registerInputs(inputs)
    }

    return modulesMap
}

export function solve1(input: string): number {

    const modulesMap = inputToModules(input)

    let lowPulsesCount = 0
    let highPulsesCount = 0

    for (let i = 0; i < 1000; i++) {
        let pulseQueue: Pulse[] = [
            {source: 'button', target: 'broadcaster', value: false}
        ]

        while (pulseQueue.length) {
            const pulse = pulseQueue.shift()!

            pulse.value ? highPulsesCount++ : lowPulsesCount++

            const module = modulesMap.get(pulse.target)
            
            if (module === undefined) {
                continue
            }

            module.processPulse(pulse).forEach(p => pulseQueue.push(p))
        }
    }

    const result = lowPulsesCount * highPulsesCount
    return result
}
 
export function solve2(input: string): number {
    const modulesMap = inputToModules(input)

    let lowPulsesCount = 0
    let highPulsesCount = 0

    // let rxCounts: number[] = []
    let lowestRxCount = Number.MAX_SAFE_INTEGER

    let modulesToWatch = {
        kv: 0,
        jg: 0,
        mr: 0,
        rz: 0,
    }

    let modulesToWatch2 = {
        kv: 0,
        jg: 0,
        mr: 0,
        rz: 0,
    }

    let modulesToWatch3 = {
        kv: 0,
        jg: 0,
        mr: 0, 
        rz: 0,
    }


    for (let i = 1; i < 29001; i++) {
        let rxCount = 0
        let pulseQueue: Pulse[] = [
            {source: 'button', target: 'broadcaster', value: false}
        ]

        while (pulseQueue.length) {
            const pulse = pulseQueue.shift()!

            pulse.value ? highPulsesCount++ : lowPulsesCount++

            const module = modulesMap.get(pulse.target)
            
            if (pulse.source in modulesToWatch && pulse.value === true) {
                if (modulesToWatch[pulse.source] === 0) {
                    modulesToWatch[pulse.source] = i
                }
                    modulesToWatch2[pulse.source] = i
                    modulesToWatch3[pulse.source] += 1
            }
            if (pulse.target === 'rx') {
                rxCount++
            }            
            if (module === undefined) {
                continue
            }

            module.processPulse(pulse).forEach(p => pulseQueue.push(p))
        }

        // rxCounts.push(rxCount)
        lowestRxCount = Math.min(rxCount, lowestRxCount)
        if (rxCount === 1) {
            return i+1
        }
    }


    let modulesToWatch4 = {
        kv: modulesToWatch2.kv - modulesToWatch.kv,
        jg: modulesToWatch2.jg - modulesToWatch.jg,
        mr: modulesToWatch2.mr - modulesToWatch.mr,
        rz: modulesToWatch2.rz - modulesToWatch.rz,
    }

    modulesToWatch4.kv /= modulesToWatch3.kv - 1
    modulesToWatch4.jg /= modulesToWatch3.jg - 1
    modulesToWatch4.mr /= modulesToWatch3.mr - 1
    modulesToWatch4.rz /= modulesToWatch3.rz - 1

    let dd = {
        kv: modulesToWatch2.kv / modulesToWatch3.kv,
        jg: modulesToWatch2.jg / modulesToWatch3.jg,
        mr: modulesToWatch2.mr / modulesToWatch3.mr,
        rz: modulesToWatch2.rz / modulesToWatch3.rz,
    }

    const result = lowPulsesCount * highPulsesCount

    const gcd = (a, b) => b == 0 ? a : gcd(b, a % b)
    const lcm = (a, b) => a / gcd(a, b) * b
    const leastCommonMultiplier = Object.values(dd).reduce(lcm, 1)

    return leastCommonMultiplier
}