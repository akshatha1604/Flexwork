const cds = require('@sap/cds')

module.exports = function (srv) {
    this.before('NEW', 'Booking', async (employeeID, BookedOn) => {
    })

    this.on("getFreeSeat", async (req) => {
        console.log("called");
 
        const { BookedSeats } = srv.entities;

        const freeSeats = await SELECT .from(srv.entities.Allstatus)
                            .where({ teamID: req.data.teamID, ID: null});
                            // || {teamID: req.data.teamID, bookingDate: !req.data.bookingDate});
        return freeSeats;
                            // return freeSeats.map((freeSeat) => freeSeat.seatID );        
    })    
}
