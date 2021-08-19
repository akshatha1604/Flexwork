const cds = require('@sap/cds')

module.exports = function () {

    this.on('removeSeat', async req => {
        if (req.params[2].seatID) {
            var seatNo = req.params[2].seatID;
        }
        var val_teamID = req.params[1].teamID;
        const { TeamSeatMapping } = this.entities;
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