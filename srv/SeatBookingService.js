const cds = require('@sap/cds')

module.exports = function (srv) {
    // this.before('NEW', 'Booking', async (employeeID, BookedOn) => {
    // })

    this.on("getFreeSeat", async (req) => {
        console.log("called");
 
        const { BookedSeats } = srv.entities;

        const freeSeats = await SELECT .from(srv.entities.Allstatus)
                            .where({ teamID: req.data.teamID, ID: null});
                            // || {teamID: req.data.teamID, bookingDate: !req.data.bookingDate});
        return freeSeats;
                            // return freeSeats.map((freeSeat) => freeSeat.seatID );        
    })

    
    this.on("getFreeSeat1", async (req) => {
        console.log("executed");
         const { BookedSeats1 } = srv.entities;

        const freeSeats1 = await SELECT .from(srv.entities.SeatStatus(ip_teamid, ip_date ))
                          where ({teamID: ip_teamid, bookingDate :ip_date, free_seat : 'TRUE' });
        return freeSeats1;
    })
}
