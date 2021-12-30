/*
This is a massive todo. QA engineer didnt bother to automate testing of his own code? Surely not...
*/
////test can be created
//const crawler = new Crawlimiter([
//   {requestLimit: 20, timeInterval: 6, initialQuota: 20},
//   {requestLimit: 100, timeInterval: 60, initialQuota: 10},
//   {requestLimit: 200, timeInterval: 180, initialQuota: 10},
//]);
////test can start
//crawler.start()
////test all requests can be created
//function requestMaker(i){
//   crawler.enqueue().then(ticket => {
//        if(ticket){
//            console.log(i);
//        }
//    }).catch(error => console.error(error)); 
//}
//for(i = 0; i < 100; i++){
//    requestMaker(i);
//}
//console.log(crawler.queue);
//setTimeout(() => {crawler.stop()}, 5000) //TODO gentle stop to empty queue first


////helper tests
// console.log(getQuotaIntervals(
//     [
//         {requestLimit: 20, timeInterval: 5},
//         {requestLimit: 100, timeInterval: 60, initialQuota: 50},
//     ]
// ));
// console.log(getQuotaIntervals({requestLimit: 100, timeInterval: 60, initialQuota: 20}));
// console.log(getQuotaIntervals([{}]));
// console.log(getQuotaIntervals([]));

// const test = {requestLimit: 100, timeInterval: 60};
// console.log(getQuotaIntervals(test));
// console.log(test);