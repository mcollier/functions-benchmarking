#r "Newtonsoft.Json"

using System;
using System.Net;
using System.Diagnostics;
using Newtonsoft.Json;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, ExecutionContext context, TraceWriter log)
{
    // Start timing function execution
    var stopwatch = Stopwatch.StartNew();

    // Parse query parameter
    string jsonContent = await req.Content.ReadAsStringAsync();
    dynamic data = JsonConvert.DeserializeObject(jsonContent);
    var qsPairs = req.GetQueryNameValuePairs()
        .ToDictionary(kv => kv.Key, kv => kv.Value, StringComparer.OrdinalIgnoreCase);
    int numModules = Convert.ToInt32(qsPairs["numModules"]);

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