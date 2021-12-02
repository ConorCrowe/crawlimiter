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