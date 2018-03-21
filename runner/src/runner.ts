import { RunConfig, verifyConfig } from './config';
import { runBenchmark } from './benchmarking';
import * as path from 'path';

// Get config path from args
const configPathRel = process.argv[2];
if (configPathRel === undefined) {
    console.error('No config file passed');
    process.exit();
}

// Load config file
const configPath = path.join(process.cwd(), configPathRel);
const config: RunConfig = require(configPath);

if (verifyConfig(config)) {
    runBenchmark(config);
} else {
    console.error(`Invalid config`);
}