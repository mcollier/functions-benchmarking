# functions-benchmarking
Measuring cold start times for serverless compute platforms

## Hosting the Function
The [function code](/functions/azure-node/) should be hosted on the appropriate platform: Azure Functions (using a Consumption plan), AWS Lambda, or Google Cloud Functions. For Node, make sure you install the required Node modules (`alexa-sdk`, `request`, `async`, and `underscore` depending on how many you want to test) as instructed by the platforms' docs.

## Running

The [runner](/runner/) will periodically call your function, measure the request time, and save the results to a file locally. It requires a config file to specify run parameters. See [Configuration](#Configuration) for details and the [sample config](/runner/sample_config.json) for an example. Note that the sample config is incomplete - you still need to fill in your function's `uri`.

```
cd runner
npm i
tsc
node ./lib/runner.js ./sample_config.json
```

The results will be saved in a `results` directory.

## Configuration
### All platforms
- `numRuns`: the number of times to call the function (i.e. your sample size)
- `numModules`: the number of Node modules the function will `require()` (`0` or `1` should be sufficient)
- `delay`: the time between requests (in seconds)
- `uri`: the full URI of your hosted function
- `language`: the language used to write the function
- `platform`: the platform hosting the function

### Azure Functions
- `fromZip`: whether your function is using the new [Run-From-Zip](https://github.com/Azure/app-service-announcements/issues/84) option
- `scaleEnabled`: whether your function is using the [new HTTP scaling behavior](https://github.com/Azure/app-service-announcements/issues/90)