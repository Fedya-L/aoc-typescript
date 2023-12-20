type Part = {
    x: number
    s: number
    a: number
    m: number
}

type Workflow = {
    identifier: string
    rules: Rule[]
}

type Workflows = Map<string, Workflow>

type Rule = {
    category: string
    shouldBeBigger: boolean
    value: number
    target: string
}

const rawPartToPart = (rawPart: string): Part => {
    const trimmed = rawPart.slice(1, rawPart.length - 1)
    const rawCategories = trimmed.split(',')
    
    let part = {}

    for (const rawCategory of rawCategories) {
        const [category, rawValue] = rawCategory.split('=')

        part[category] = +rawValue
    }

    return part as Part
}

const rawRuleToRule = (rawRule: string): Rule => {
    
    let split = rawRule.split(':')

    if (split.length == 1) {
        return {
            category: 'a',
            shouldBeBigger: true,
            value: 0,
            target: split[0]   
        }
    }

    const target = split[1]

    split = split[0].split('>')
    let shouldBeBigger = split.length == 2

    if (split.length == 1) {
        split = split[0].split('<')
    }

    return {
        category: split[0],
        shouldBeBigger,
        value: +split[1],
        target,
    }
  
}

const rawWorkflowToWorkflow = (rawWorkflow: string): Workflow => {
    const [identifier, rawRules] = rawWorkflow.slice(0, rawWorkflow.length - 1).split('{')

    const rules = rawRules.split(',').map(rawRuleToRule)

    return {
        identifier,
        rules,
    }
}

const inputToWorkflowsAndParts = (input: string): [Map<string, Workflow>, Part[]] => {
    let workflows = new Map<string, Workflow>()
    let parts: Part[] = []

    const [rawWorkflows, rawParts] = input.split("\n\n")

    parts = rawParts.split("\n").map(rawPartToPart)
    
    const workflowsArray = rawWorkflows.split("\n").map(rawWorkflowToWorkflow)
    for (const w of workflowsArray) {
        workflows.set(w.identifier, w)
    }

    return [workflows, parts]
}

export const solve1 = (input: string): number => {
    const [workflows, parts] = inputToWorkflowsAndParts(input)

    let acceptedParts: Part[] = []

    for (const p of parts) {
        let wId = 'in'
        let inProgress = true

        while (inProgress) {
            let workflow = workflows.get(wId)!
            for (const r of workflow.rules) {
                if (r.shouldBeBigger && p[r.category] > r.value) {
                    wId = r.target
                    break
                } 
                if (!r.shouldBeBigger && p[r.category] < r.value) {
                    wId = r.target
                    break
                }
            }

            if (wId === 'A') {
                inProgress = false   
                acceptedParts.push(p)
            }
            if (wId === 'R') {
                inProgress = false
            }
        }
    }


    const result = acceptedParts.map(p => p.x + p.m + p.a + p.s).reduce((p,c) => p + c, 0)
    return result
}

type Range = {
    min: number
    // Inclusive
    max: number
}


type PartWithRanges = {
    x: Range
    m: Range
    a: Range
    s: Range
}

type State = {
    workflowId: string
    ruleIndex: number
    part: PartWithRanges
}

const splitRangeFrom = (range: Range, splitValue: number): [Range, Range] => {
    let smallerRange = {...range}
    let largerRange = {...range}

    smallerRange.max = splitValue - 1
    largerRange.min = splitValue

    return [smallerRange, largerRange]
}

export const solve2 = (input: string): number => {

    const [workflows] = inputToWorkflowsAndParts(input)

    let statesToProcess: State[] = [
        {
            workflowId: 'in',
            ruleIndex: 0,
            part: {
                x: {min: 1, max: 4000},
                m: {min: 1, max: 4000},
                a: {min: 1, max: 4000},
                s: {min: 1, max: 4000},
            }
        }
    ]

    let acceptedParts: PartWithRanges[] = []

    while (statesToProcess.length) {
        const s = statesToProcess.pop()!
        const p = s.part
        const w = workflows.get(s.workflowId)!

        if (s.workflowId === 'A') {
            acceptedParts.push(s.part)
            continue
        }
        if (s.workflowId === 'R') {
            continue
        }

        const r = w.rules[s.ruleIndex]
        if (r.value === 0) {
            statesToProcess.push({
                workflowId: r.target,
                ruleIndex: 0,
                part: s.part
            })
            continue
        }

        const testedRange = p[r.category] as Range
        if (r.shouldBeBigger) {
            if (testedRange.min > r.value) {
                // Pass the full range to next workflow
                statesToProcess.push({
                    workflowId: r.target,
                    ruleIndex: 0,
                    part: p
                })
            } else if (testedRange.max <= r.value) {
                // Pass the full range to next rule
                statesToProcess.push({
                    workflowId: s.workflowId,
                    ruleIndex: s.ruleIndex + 1,
                    part: p
                })
            } else {
                // Now we will split
                const [lowerRange, higherRange] = splitRangeFrom(testedRange, r.value + 1)

                // Higher range will go to next workflow
                let higherPart = {...p}
                higherPart[r.category] = higherRange
                statesToProcess.push({
                    workflowId: r.target,
                    ruleIndex: 0,
                    part: higherPart
                })
                // Lower range will go to next rule
                let lowerPart = {...p}
                lowerPart[r.category] = lowerRange
                statesToProcess.push({
                    workflowId: s.workflowId,
                    ruleIndex: s.ruleIndex + 1,
                    part: lowerPart
                })
            }
        } else {
            if (testedRange.max < r.value) {
                // Pass the full range to next workflow
                statesToProcess.push({
                    workflowId: r.target,
                    ruleIndex: 0,
                    part: p
                })
            } else if (testedRange.min >= r.value) {
                // Pass the full range to next rule
                statesToProcess.push({
                    workflowId: s.workflowId,
                    ruleIndex: s.ruleIndex + 1,
                    part: p
                })
            } else {
                // Now we will split
                const [lowerRange, higherRange] = splitRangeFrom(testedRange, r.value)

                // Higher range will go to next rule
                let higherPart = {...p}
                higherPart[r.category] = higherRange
                statesToProcess.push({
                    workflowId: s.workflowId,
                    ruleIndex: s.ruleIndex + 1,
                    part: higherPart
                })
                // Lower range will go to next workflow
                let lowerPart = {...p}
                lowerPart[r.category] = lowerRange
                statesToProcess.push({
                    workflowId: r.target,
                    ruleIndex: 0,
                    part: lowerPart
                })
            }
        }
    } 

    const result = acceptedParts.map((p) => {
        p.x.max -= p.x.min - 1
        p.x.min -= p.x.min - 1

        p.m.max -= p.m.min - 1
        p.m.min -= p.m.min - 1

        p.a.max -= p.a.min - 1
        p.a.min -= p.a.min - 1

        p.s.max -= p.s.min - 1
        p.s.min -= p.s.min - 1
        return (
            p.x.max * 
            p.m.max * 
            p.a.max * 
            p.s.max
        )
    }).reduce((p,c) => p + c, 0)

    return result
}