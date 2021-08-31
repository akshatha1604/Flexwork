const cds = require('@sap/cds');

module.exports =  function (srv) {

    // const AdminSrv = cds.connect.to('AdminService');
    srv.after('draftActivate', 'SAPOfficeData', (team, req) => {        
        console.log('hi from post');
        // var managerExists = await SELECT.one.from(this.entities.TeamEmployeeMaster).where({ teamID: req[0].teamID, locationID: req[0].locationID });
        // if (managerExists = null) {
        //     const { employee } = this.entities.TeamEmployeeMaster;
        //     employee.employeeID = req[0].employeeID;  
        //     employee.teamID = req[0].teamID;
        //     employee.role = 1;
        //     const managerRecInserted = await INSERT.into(AdminService.TeamEmployeeMaster).entry(employee);
        //     if (managerRecInserted > 0) {
        //         req.notify(200, 'Employee Successfully inserted');
        //     }
        // }
    })


    const { TeamSeatMapping } = srv.entities;
    srv.after('READ', 'Teams', (teams, req) => {
        if (teams.length) {
            return Promise.all(teams.map(async team => {
                const getSeatAssigned = await cds.transaction(req).run(SELECT.from(TeamSeatMapping).where({ teamID: team.teamID, locationID: team.locationID }));
                team.seatAssigned = getSeatAssigned.length;
                team.seatUnassigned = Math.round((team.employeeCount / 100) * team.maxSeatPercent) - team.seatAssigned;
            }))
        }
    })

    srv.on('removeSeat', async req => {
        if (req.params[2].seatID) {
            var seatNo = req.params[2].seatID;
        }
        var val_teamID = req.params[1].teamID;
        const { TeamSeatMapping } = this.entities;
        const n = await DELETE.from(TeamSeatMapping).where({ seatId: seatNo });
        if (n > 0) {
            req.notify(204, 'Data Successfully deleted');
            return n;
        }
        else {
            req.error(400, "Deletion failed");
        }
    })

    srv.on('removeTeam', async (req) => {
        var val_locationID = req.params[1].locationID_locationID;
        var val_teamID = req.params[1].teamID;
        var teamseat_exists = await SELECT.one.from(this.entities.TeamSeatMapping).where({ teamID: val_teamID, locationID: val_locationID });
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
    })

}



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
