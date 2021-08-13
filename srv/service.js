const cds = require('@sap/cds')

class AdminService extends cds.Service {
     init() {


           const { Teams } = this.entities
        //    this.on removeSeat(){
        //     this.on ('','Books', (req)=>{...})
        //debugger;  
        
     //   return super.init()
    }
}

// module.exports = cds.service.impl(srv => {
//     srv.before('CREATE', 'Books', req => console.log('before CREATE triggered'))
// }

// )