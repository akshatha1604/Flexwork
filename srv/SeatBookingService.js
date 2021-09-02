const cds = require('@sap/cds')

module.exports =  function (srv) {
 this.before ('NEW', 'Booking', async (req) => {
 
})

this.on("getFreeSeat", async (req) => {
    console.log("called");
    return 'called';
})


// this.on('READ','Booking', (req)=>{
    

// })
}
