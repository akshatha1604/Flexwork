const cds = require('@sap/cds')

module.exports = function (srv) {
    // this.before('NEW', 'Booking', async (employeeID, BookedOn) => {
    // })

    // this.on("getFreeSeat", async (req) => {
    //     console.log("called");
 
    //     const { BookedSeats } = srv.entities;

    //     const freeSeats = await SELECT .from(srv.entities.Allstatus)
    //                         .where({ teamID: req.data.teamID, ID: null});
    //                         // || {teamID: req.data.teamID, bookingDate: !req.data.bookingDate});
    //     return freeSeats;
    //                         // return freeSeats.map((freeSeat) => freeSeat.seatID );        
    // })

    
    // this.on("getFreeSeat1", async (req) => {
    //     console.log("executed");
    //      const { BookedSeats1 } = srv.entities;

    //     const freeSeats1 = await SELECT .from(srv.entities.SeatStatus(req.data.teamID, req.data.bookingDate ))
    //                       where ({teamID: req.data.teamID, bookingDate: req.data.bookingDate, free_seat : 'TRUE' });
    //     return freeSeats1;
    // })
 this.before('READ','Booking',async(context)=>{
     console.log(context.query);
		const tx = db.tx(context);
     console.log('hello');
     console.log('TX' + tx);
 } )
}
