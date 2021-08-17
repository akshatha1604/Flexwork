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

    })
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