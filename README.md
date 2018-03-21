# functions-benchmarking
Measuring cold start times for Azure Functions

## Hosting the Function
The [function code](/function/) should be hosted as an Azure Function using a Consumption plan. Make sure you `npm install` the required modules (`alexa-sdk`, `request`, `async`, and `underscore` depending on how many you want to test).

## Running

The [runner](/runner/) will periodically call your Function, measure the request time, and save the results to a file locally. It requires a config file to specify run parameters. See the [sample config](/runner/sample_config.json) for an example. Note that the sample config is incomplete - you still need to fill in your Function's `uri`.

```
cd runner
npm i
tsc
node ./lib/runner.js ./sample_config.json
```

The results will be saved in a `results` directory.

## Configuration
- `numRuns`: the number of times to call the Function (i.e. your sample size)
- `numModules`: the number of Node modules the Function will `require()` (`0` or `1` should be sufficient)
- `delay`: the time between requests (in seconds)
- `fromZip`: whether your Function is using the new [Run-From-Zip](https://github.com/Azure/app-service-announcements/issues/84) option
- `scaleEnabled`: whether your Function is using the [new HTTP scaling behavior](https://github.com/Azure/app-service-announcements/issues/90)
- `uri`: the full URI of your hosted Function