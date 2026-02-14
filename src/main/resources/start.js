'use strict';

console.log("Initializing....");
JetStream.initialize().catch((e) => {
    console.error("Fatal error initializing JetStream: %s", e);
    console.error(e.stack);
}).then(() => {
    console.log("Starting...");
    var result = JetStream.start();
    console.log("Finished starting.");
    if (result) {
        result.then((v, e) => {
            if (e) {
                console.error("Fatal error starting JetStream: %s", e);
                console.error(e.stack);
            } else {
                console.log("All done.");
                //console.log(JSON.stringify(performance.getEntriesByType("measure")));
            }
        })
    }
})
