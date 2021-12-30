//TODO add error handling for invalid formats
function getQuotaIntervals(requestLimits) {
    const processedLimits = [];
    var cumuQuota = 0;
    //handle single limit or create array copy
    const temp = [];
    if (Array.isArray(requestLimits)) {
        requestLimits.forEach(limit => temp.push(limit));
    } else {
        temp.push(requestLimits);
    }

    temp.forEach(limit => {
        if (
            Number.isInteger(limit.requestLimit) &&
            Number.isInteger(limit.timeInterval) &&
            (limit.initialQuota == null || Number.isInteger(limit.initialQuota))
        ) {
            processedLimits.push(processLimits(limit));
        } else {
            throw `Provided values incorrect. Should be of the format 
            {requestLimit: (int), timeInterval: (int), //optional initialQuota: (int)}`;
        }
    });

    processedLimits.sort((first, second) => {
        return second.dripInterval - first.dripInterval;
    });
    Object.keys(processedLimits)
        .reverse()
        .forEach(index => {
            //TODO add error handling if max quota < 0
            processedLimits[index].maxQuota -= cumuQuota;
            cumuQuota += processedLimits[index].maxQuota;

            if (processedLimits[index].initialQuota) {
                processedLimits[index].currentQuota = processedLimits[index].initialQuota;
            } else {
                processedLimits[index].currentQuota = processedLimits[index].maxQuota;
            }
            
        });
    return processedLimits;
}

function getDripInterval(timeInterval, requestLimit) {
    //convert interval to millisec
    //TODO add interpreter for text input
    var milli = timeInterval * 1000;

    return milli / requestLimit;
}

function processLimits(limit) {
    const processedLimit = new Object();

    processedLimit.dripInterval = getDripInterval(
        limit.timeInterval,
        limit.requestLimit
    );

    processedLimit.maxQuota = limit.requestLimit;

    if ("initialQuota" in limit) {
        processedLimit.initialQuota = limit.initialQuota;
    } else {
        processedLimit.initialQuota = null;
    }

    return processedLimit;
}

module.exports = {
    getQuotaIntervals: getQuotaIntervals
};
