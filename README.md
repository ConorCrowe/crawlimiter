# crawlimiter

## About
Crawlimiter is a promise-based rate limiter for node.js which is useful for crawling/api requests. Crawlimiter uses hierarchical token buckets to handle multi-level rate limits and also a request queue to eliminate race conditions.

## Usage
Import Crawlimiter module and declare a new limiter. Crawlimiter takes a list of rate limits. Each rate limit must contain the total number of requests and a time interval given in seconds. Also supports an optional initial quota field (if none given, initial quota will default to the request limit). The order in which the limits are provided does not matter.

```JavaScript
const Crawlimiter = require("Crawlimiter");

const apiLimiter = new Crawlimiter([
    {requestLimit: 20, timeInterval: 6, initialQuota: 20},
    {requestLimit: 100, timeInterval: 60},
    {requestLimit: 200, timeInterval: 180},
]);
```
Once the limiter has been declared, requests can be queued using the enqueue method. Crawlimiter will resolve the promise to true if quota is available for the request. Requests will wait in the queue if no quota is available.

```JavaScript
var result = apiLimiter.enqueue(i);

result.then(ticket => {
    if(ticket){
        //do something
    }
}).catch(error => console.error(error));
```

If requests need to stopped for some time the pause or stop methods can be used. Pause will stop quota being given to requests but will preserve the queue state. Stop will stop quota being given and also clear the queue.

```JavaScript
apiLimiter.pause();
//OR
apiLimiter.stop();
```
