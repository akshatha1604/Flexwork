using {app.schema_flexwork as me} from '../db/schema';

service AdminService @(impl : './adminService.js') {
    entity SAPOfficeData   as projection on me.SAPOfficeData;

    entity Teams           as projection on me.Teams actions {                
        action removeTeam() returns String;
        action addTeam(teamName_ip : String ) returns String;
    };

    


    entity TeamSeatMapping as projection on me.TeamSeatMapping actions {
        action removeSeat() returns String;
    }

//  @sap.applicable.path : 'addSeats'
// action addSeat();
}

service SeatBooking {
    entity Booking as projection on me.Booking;
    entity TeamSeatMapping as projection on me.TeamSeatMapping;
    entity SAPOfficeData as projection on me.SAPOfficeData;
    entity Teams as projection on me.Teams;
    entity TeamEmployeeMaster as projection on me.TeamEmployeeMaster;
    entity Privileges as projection on me.Privileges;
    entity BookingStatus as projection on me.BookingStatus;
    entity AttendanceStatus as projection on me.AttendanceStatus;
    entity DayCodes as projection on me.DayCodes;
    entity SeatMaster as projection on me.SeatMaster;
    
    entity Users   as projection on me.Users;
    //  @sap.applicable.path : 'quickBook'
    action quickBook();
    //  @sap.applicable.path : 'showAvailability'
    action showAvailability();
    //  @sap.applicable.path : 'updateBooking'
    action updateBooking();
    //  @sap.applicable.path : 'managerZone'
    action managerZone();
    //  @sap.applicable.path : 'seatMap'
    action seatMap();
}
