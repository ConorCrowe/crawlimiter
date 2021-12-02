const helper = require("./crawlimiterHelper");
//requestLimits = [{requestLimit:, timeInterval:, initialQuota:, }, {}, ...] //{requestLimit: , timeInterval: , random: True, range: 2}
//check limits upwards from lowest rate to highest.
//Hierarchical token buckets

const Crawlimiter = class {
    //interval in seconds
    constructor(requestLimits, startImmediately = true, random = null, randomRange = null) {
        //TODO implement random interval variance for crawling
        this.buckets = helper.getQuotaIntervals(requestLimits); //ordered lowest rate to highest[{interval: , initialQuota: ,maxQuota: ,currentQuota}, ...]
        this.queue = [];
        this.queueLengthLimit = null;
        this.intervals = [];
        //this.processing = [];
        //this.random = random;
        //this.randomRange = randomRange;
        if (startImmediately){this.start();}
    }

    enqueue() {
        //TODO if request is a function that returns a promise then this promise can
        //instead return the fulfilled promise in the resolve. This would look
        //something like request().then(response => {this.processing[id].remove(); resolve(response)},
        //error => reject(error));
        return new Promise((resolve, reject) => {
            const callback = function(quotaGiven) {
                if (quotaGiven) {
                    //random interval to return ticket can be added here.
                    //need to add a queue to ensure random intervals
                    resolve(true); //current iteration just returns true to allow execution
                    //in some situations delayed requests may cause rate exceeding
                    
                } else {
                    reject("error: quota not given"); //TODO error for queue overflow
                }
            };
            if (true || this.queue.length < this.queueLengthLimit) {
                //TODO a way to define queue limit
                //pushes to queue
                this.queue.push(callback);
            } else {
                reject("error: queue full");
            }
        });
    }

    process() {
        while (
            this.buckets[this.buckets.length - 1].currentQuota > 0 &&
            this.queue.length > 0
        ) {
            --this.buckets[this.buckets.length - 1].currentQuota;
            this.queue.shift()(true);
        }
    }

    getQuota() {
        return this.buckets;
    }

    start() {
        //start interval for each bucket
        this.buckets.forEach((_bucket, index) => {
            this.quotaDripper(index);
        });
    }

    quotaDripper(bucketIndex) {
        const currentBucket = this.buckets[bucketIndex];

        if (bucketIndex == 0) {
            //top Bucket
            this.intervals[bucketIndex] = setInterval(() => {
                if (currentBucket.currentQuota < currentBucket.maxQuota) {
                    currentBucket.currentQuota++;
                    // console.log(`added quota(${currentBucket.currentQuota}) to bucket with interval ${currentBucket.dripInterval}`);
                }
            }, currentBucket.dripInterval);
        } else {
            //sub bucket
            const aboveBucket = this.buckets[bucketIndex - 1];
            this.intervals[bucketIndex] = setInterval(() => {
                if (
                    currentBucket.currentQuota < currentBucket.maxQuota &&
                    aboveBucket.currentQuota > 0
                ) {
                    aboveBucket.currentQuota--;
                    currentBucket.currentQuota++;
                    // console.log(`added quota(${currentBucket.currentQuota}) to bucket with interval ${currentBucket.dripInterval}`);
                }
                if (
                    bucketIndex == this.buckets.length - 1 &&
                    this.queue.length > 0
                ) {
                    this.process();
                }
            }, currentBucket.dripInterval);
        }
    }

    pause() {
        console.log("stopping intervals...");
        this.intervals.forEach(interval => {
            clearInterval(interval);
        });
        console.log("crawlimiter paused.");
    }

    stop() {
        console.log("stopping intervals...");
        this.intervals.forEach(interval => {
            clearInterval(interval);
        });
        console.log("resetting buckets...");
        this.buckets.forEach(bucket => {
            bucket.currentQuota = bucket.initialQuota;
        });
        console.log("clearing queue...");
        while (
            this.queue.length > 0
        ) {
            this.queue.shift()(false);
        }
        console.log("crawlimiter stopped.");
    }
};

module.exports = Crawlimiter;



