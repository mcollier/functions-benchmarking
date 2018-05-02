using System;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;

namespace AzFunBenchmarkerCSVS
{
    public static class BenchmarkerCSVS
    {
        [FunctionName("BenchmarkerCSVS")]
        public static async Task<HttpResponseMessage> Run([HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)]HttpRequestMessage req, ExecutionContext context, TraceWriter log)
        {
            // Start timing function execution
            var stopwatch = Stopwatch.StartNew();

            // Parse query parameter
            string numModulesParam = req.GetQueryNameValuePairs()
                .FirstOrDefault(q => string.Compare(q.Key, "numModules", true) == 0)
                .Value;
            int numModules = Int32.Parse(numModulesParam);

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

            return req.CreateResponse(HttpStatusCode.OK, new {
                requestId = context.InvocationId,
                benchmarks = benchmarks
            });
        }
    }
}
