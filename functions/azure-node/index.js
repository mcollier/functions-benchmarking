function benchmark(fn, benchmarkArr, type, name) {
    // Default name is "function"
    name = typeof name !== 'undefined' ? name : 'function';

    // Run the function and time it
    const startTime = process.hrtime();
    const result = fn();
    const duration = process.hrtime(startTime);
    const durationMs = duration[0] * 1000 + duration[1] / 1000000;

    // Push results to array (if provided)
    benchmarkArr.push({
        name: name,
        type: type,
        duration: durationMs
    });

    // Return original function's result
    return result;
}

const availableModules = ['alexa-sdk', 'request', 'async', 'underscore'];

module.exports = function (context, req) {
    let benchmarks = [];

    // Wrap main logic in a function, so we can benchmark the whole thing
    function functionWrapper() {
        const numModulesParam = ((context.req || {}).query || {}).numModules;
        const numModules = numModulesParam || 0;
        let requireTime = 0;

        // Benchmark require() on some modules
        for (let i = 0; i < numModules; ++i) {
            let mod = availableModules[i];
            benchmark(() => require(mod), benchmarks, 'require', 'require ' + mod);
            requireTime += benchmarks[benchmarks.length - 1].duration;
        }

        // Add benchmark for total require time
        if (numModules > 0) {
            benchmarks.push({
                name: 'total require',
                type: 'other',
                duration: requireTime
            });
        }
    };

    // Benchmark the entire benchmarking function
    benchmark(functionWrapper, benchmarks, 'other', 'functionTime');

    let result = {
        requestId: context.bindingData.invocationId,
        benchmarks: benchmarks
    };

    context.done(null, { res: result });
};