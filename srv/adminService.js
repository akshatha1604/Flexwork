const cds = require('@sap/cds')



module.exports = function () {

    this.on('removeSeat', async req => {
        if (req.params[2].seatID) {
            seatNo = req.params[2].seatID;
        }
        const { TeamSeatMapping } = this.entities;
        const n = await DELETE.from(TeamSeatMapping).where({ seatId: seatNo });
        if (n > 0) {
            req.notify(200, 'Data Successfully deleted');
            //   var model = req._model;
            //  model.refresh();
        }
        else {
            req.error(400, "Deletion failed");
        }

    });

    this.on('removeTeam', async (req) => {
        val_locationID = req.params[1].locationID_locationID;
        val_teamID = req.params[1].teamID;
        let teamseat_exists = await SELECT.one.from (this.entities.TeamSeatMapping) .where ({teamID: val_teamID, locationID: val_locationID});
        // console.log(teamseat_exists);
        if (teamseat_exists != null) {
            req.error(400, "Please delete Seat assignments before deleting the Teams");
        }
        else {
            const { Teams } = this.entities;
            const TeamDel_success = await DELETE.from(Teams) .where({ locationID_locationID: val_locationID, teamID: val_teamID });
            if (TeamDel_success > 0) {
                req.notify(200, 'Data Successfully deleted');
            }
            else {
                req.error(400, "Deletion failed");
            }
        }

    }

    )
};



// class AdminService extends cds.Service {
//      init() {


//            const { Teams } = this.entities
//         //    this.on removeSeat(){
//         //     this.on ('','Books', (req)=>{...})
//         //debugger;  

//      //   return super.init()
//     }
// }

// // module.exports = cds.service.impl(srv => {
// //     srv.before('CREATE', 'Books', req => console.log('before CREATE triggered'))
// // }

// // )