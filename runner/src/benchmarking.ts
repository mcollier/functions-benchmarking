import * as request from 'request-promise';
import * as fs from 'fs';
import * as readline from 'readline';
import { RunConfig } from './config';

interface BenchmarkingResult {
    requestId: string,
    benchmarks: {
        name: string,
        type: "require" | "other",
        duration: number
    }[],
    numModules?: number,
    delay?: number,
    fromZip?: boolean,
    scaleEnabled?: boolean
}

export async function runBenchmark(config: RunConfig) {
    // Print debug info
    process.stdout.write(`${config.numModules} MODULE, ${config.delay} DELAY, ${config.numRuns} RUNS`);
    if (config.fromZip) process.stdout.write(`, FROM ZIP`);
    if (config.scaleEnabled) process.stdout.write(`, SCALE ENABLED`);
    process.stdout.write(`\n`);

    // Initial request (not recorded)
    process.stdout.write(`Making initial request... `);
    await callFunction(config.uri, config.numModules);
    process.stdout.write(`done\n`);

    // Pad the delay a bit
    const paddedDelay = config.delay + Math.min(config.delay * 0.1, 60);

    for (let run = 1; run <= config.numRuns; ++run) {
        // Wait between requests
        process.stdout.write(`Waiting ${paddedDelay} seconds... `);
        await delay(paddedDelay * 1000);
        readline.cursorTo(process.stdout, 0);

        // Make the next request and get the result
        process.stdout.write(`Making request #${run}... `);
        const funcRes = await callFunction(config.uri, config.numModules);
        process.stdout.write(`${funcRes.elapsedTime} ms\n`);

        // Add extra benchmarking info
        const res = funcRes.body as BenchmarkingResult;
        res.benchmarks.push({
            name: 'requestTime',
            type: 'other',
            duration: funcRes.elapsedTime
        });
        res.numModules = config.numModules;
        res.delay = config.delay;
        res.fromZip = config.fromZip;
        res.scaleEnabled = config.scaleEnabled;

        // Save to file
        if (!fs.existsSync('./results')) {
            fs.mkdirSync('./results');
        }
        fs.writeFileSync(`./results/${res.requestId}.json`, JSON.stringify(res, null, 4), 'utf8');
    }
}

async function callFunction(uri: string, numModules: number) {
    const opts: request.OptionsWithUri = {
        uri: uri,
        json: true,
        body: {},
        qs: {
            numModules: numModules
        },
        time: true,
        resolveWithFullResponse: true
    };

    return await request.post(opts);
}

async function delay(ms: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, ms);
    });
}
