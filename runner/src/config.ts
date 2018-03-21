export interface RunConfig {
    numRuns: number,
    numModules: number,
    delay: number,
    fromZip: boolean,
    scaleEnabled: boolean
    uri: string
}

export function verifyConfig(c: RunConfig): boolean {
    return typeof c.numRuns === 'number'
        && c.numRuns > 0
        && typeof c.numModules === 'number'
        && c.numModules >= 0
        && typeof c.delay === 'number'
        && c.delay > 0
        && typeof c.fromZip === 'boolean'
        && typeof c.scaleEnabled === 'boolean'
        && typeof c.uri === 'string'
        && c.uri.length > 0;
}