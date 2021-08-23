const cds = require('@sap/cds')

module.exports = function () {
    /*
        //     function setSeatInfo(Teams) {
        //   if (book.stock > 111) book.title += ` -- 11% discount!`
        // }
        const { TeamSeatMapping } = this.entities;
        const { Teams } = this.entities;
        // this.after('READ', Teams, (teams, req) => {
        //     return teams.map(async team => {
        //         const getSeatAssigned = await cds.transaction(req).run(SELECT.from(TeamSeatMapping).where({ teamID: req.params[1].teamID, locationID: req.params[0].locationID }));
        //         team.seatAssigned = getSeatAssigned.length;
        //     })
        // }
        // )
    this.after('READ', Teams, async req => {
         const getSeatAssigned = await cds.transaction(req).run(SELECT.from(TeamSeatMapping).where({ teamID: Teams.teamID, locationID: Teams.locationID }));
         console.log(getSeatAssigned.length);
        }
    )
    */

    this.on('removeSeat', async req => {
        if (req.params[2].seatID) {
            var seatNo = req.params[2].seatID;
        }
        var val_teamID = req.params[1].teamID;
        const { TeamSeatMapping } = this.entities;
        // //var count = TeamSeatMapping.count .where ({teamID: req.params[1].teamID, locationID: req.params[0].locationID});
        // // count = Select.from("TeamSeatMapping") .having (func("count", TeamSeatMapping).where ({teamID: req.params[1].teamID, locationID: req.params[0].locationID}));
        // // var count = TeamSeatMapping.count;
        // const getSeatAssigned = await cds.transaction(req).run(SELECT .from (TeamSeatMapping) .where({teamID: req.params[1].teamID, locationID: req.params[0].locationID}));

        // // var count = count(TeamSeatMapping);
        // console.log(getSeatAssigned);
        // var sql = "SELECT count(*) as total FROM TeamSeatMapping";
        // var query = connection.query(sql, function (err, result) {

        //     console.log("Total Records:- " + result[0].total);

        // });
        // console.log(count);
        const n = await DELETE.from(TeamSeatMapping).where({ seatId: seatNo });

        if (n > 0) {
            req.notify(204, 'Data Successfully deleted');
            return n;

            //   let remainingSeat = await SELECT .from (TeamSeatMapping) .where ({teamID:  req.params[1].teamID, locationID:  req.params[1].locationID_locationID});
            //   return remainingSeat;
        }
        else {
            req.error(400, "Deletion failed");
        }

    });

    this.on('removeTeam', async (req) => {
        var val_locationID = req.params[1].locationID_locationID;
        var val_teamID = req.params[1].teamID;
        var teamseat_exists = await SELECT.one.from(this.entities.TeamSeatMapping).where({ teamID: val_teamID, locationID: val_locationID });
        // console.log(teamseat_exists);
        if (teamseat_exists != null) {
            req.error(400, "Please delete Seat assignments before deleting the Teams");
        }
        else {
            const { Teams } = this.entities;
            const TeamDel_success = await DELETE.from(Teams).where({ locationID_locationID: val_locationID, teamID: val_teamID });
            if (TeamDel_success > 0) {
                req.notify(200, 'Data Successfully deleted');
            }
            else {
                req.error(400, "Deletion failed");
            }
        }
    });

    this.on('addTeam', async (req) => {
        var val_locationID = req.params[1].locationID_locationID;
    });
};

//  this.('addSeat', async(req) => {
    //  const Teams  = Array.isArray(teamsData) ? teamsData : [teamsData];
    //  Teams.forEach(team =>{ 
    //      var count = func("count", this.entities.TeamSeatMapping ) .where ({teamID: Teams.teamID, locationID: Teams.locationID});
    //      console.log(count);  
    // console.log("Hi after");       

    // if (req.params[2].seatID) {
    //         seatNo = req.params[2].seatID;
    //     }
    //     const { TeamSeatMapping } = this.entities;
    //     const n = await DELETE.from(TeamSeatMapping).where({ seatId: seatNo });
    //     if (n > 0) {
    //         req.notify(200, 'Data Successfully deleted');
    //         //   var model = req._model;
    //         //  model.refresh();
    //     }
    //     else {
    //         req.error(400, "Deletion failed");
    //     }

    // });



// class AdminService extends cds.ApplicationService {
// init() {

// const { TeamSeatMapping, Teams, BookingSupplement } = this.entities

//     this.on('removeSeat', async req => {
//         if (req.params[2].seatID) {
//          var   seatNo = req.params[2].seatID;
//         }
//         let val_teamID = req.params[1].teamID;
//         const { TeamSeatMapping } = this.entities;
//         const n = await DELETE.from(TeamSeatMapping).where({ seatId: seatNo });
//         if (n > 0) {
//             req.notify(204, 'Data Successfully deleted');

//             //  this.after('READ','TeamSeatMapping', (each)=>{
//             // each.stock > 111 && each.discount='11%'
//             //})

//                let remainingSeat = await SELECT .from (TeamSeatMapping) .where ({teamID:  req.params[1].teamID, locationID:  req.params[1].locationID_locationID});
//               return remainingSeat;
//         }
//         else {
//             req.error(400, "Deletion failed");
//         }

//     });

//     return super.init();

// }
// }


// module.exports = {AdminService}