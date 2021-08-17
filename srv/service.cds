using {app.schema_flexwork as me} from '../db/schema';

service AdminService @(impl : './adminService.js') {
    entity SAPOfficeData   as projection on me.SAPOfficeData;

    entity Teams           as projection on me.Teams actions {
     //   @sap.applicable.path : 'removeTeam'
        action removeTeam() returns String;
    };

    entity TeamSeatMapping as projection on me.TeamSeatMapping actions {
    //  @sap.applicable.path : 'removeSeats'
    //  action removeSeat(SeatList : array of TeamSeatMapping ) returns String;
        action removeSeat() returns String;
    }

  //  @sap.applicable.path : 'addSeats'
   // action addSeat();
}

service SeatBooking {
    entity Booking as projection on me.Booking;

   // @readonly
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
