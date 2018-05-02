using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Diagnostics;

using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;

using Newtonsoft.Json;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.Json.JsonSerializer))]

namespace LambdaCS
{
    public class Function
    {
        public APIGatewayProxyResponse FunctionHandler(APIGatewayProxyRequest request, ILambdaContext context)
        {
            // Start timing function execution
            var stopwatch = Stopwatch.StartNew();

            // Parse query parameter
            int numModules = 0;
            string numModulesParam;
            if (request.QueryStringParameters.TryGetValue("numModules", out numModulesParam)) {
                Int32.TryParse(numModulesParam, out numModules);
            }

            // Stop timing function execution
            stopwatch.Stop();
            var elapsedMs = stopwatch.ElapsedMilliseconds;

            // Add benchmark for function time
            var benchmarks = new[] {
                new {
                    name = "functionTime",
                    type = "other",
                    duration = elapsedMs
                }
            };

            var response = new {
                requestId = context.AwsRequestId,
                benchmarks = benchmarks
            };

            return new APIGatewayProxyResponse {
                Body = JsonConvert.SerializeObject(response),
                StatusCode = 200
            };            
        }
    }
}
