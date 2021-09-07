using {app.schema_flexwork as me} from '../db/schema';

service AdminService @(impl : './adminService.js') {
    entity SAPOfficeData      as projection on me.SAPOfficeData;
    entity TeamEmployeeMaster as projection on me.TeamEmployeeMaster;

    //  entity Teams as projection on me.Teams
    entity Teams              as
        select from me.Teams {
            *,
            null as seatAssigned   : Integer @Core.Computed,
            null as seatUnassigned : Integer @Core.Computed
        };
    // actions {
    //  //   action removeTeam() returns String;
    // };

    entity TeamSeatMapping    as projection on me.TeamSeatMapping actions {
        action removeSeat() returns Integer;
    }

    entity Cities             as projection on me.Cities;
    entity Offices            as projection on me.Offices;
    entity Buildings          as projection on me.Buildings;
    entity Users              as projection on me.Users;
    entity TeamSeatImage      as projection on me.TeamSeatingImage;
}


service SeatBooking @(impl : './SeatBookingService.js') {
    entity Booking            as projection on me.Booking;
    entity TeamSeatMapping    as projection on me.TeamSeatMapping;
    entity SAPOfficeData      as projection on me.SAPOfficeData;
    entity Teams              as projection on me.Teams;
    entity TeamEmployeeMaster as projection on me.TeamEmployeeMaster;
    entity Privileges         as projection on me.Privileges;
    entity BookingStatus      as projection on me.BookingStatus;
    entity AttendanceStatus   as projection on me.AttendanceStatus;
    entity DayCodes           as projection on me.DayCodes;
    entity SeatMaster         as projection on me.SeatMaster;
    entity Users              as projection on me.Users;
    entity TeamMemberRole     as projection on me.TeamMemberRoles;

    // entity V_BookedSeats(ip_teamID : String, ip_bookingDate : Date) as
    //     select from Booking {
    //         Booking.employeeID.employeeID.ID as empID,
    //         Booking.seatID,
    //         Booking.bookedBy,
    //         Booking.bookingDate,
    //         Booking.dayCode,
    //         Booking.status,
    //         Booking.employeeID.teamID        as teamID
    //     };

    entity BookedSeats        as projection on Booking {
        Booking.ID, Booking.employeeID.employeeID.ID as empID, Booking.seatID, Booking.bookedBy, Booking.bookingDate, Booking.dayCode, Booking.status, Booking.employeeID.teamID as teamID
    };

    // entity BookedSeats(ip_teamID : String, ip_bookingDate : Date)
    //  as select from me.bookedSeats(ip_teamID: :ip_teamID, ip_bookingDate: :ip_bookingDate){*};

    entity Allstatus          as
        select from TeamSeatMapping
        left outer join BookedSeats
            on(
                    TeamSeatMapping.teamID = BookedSeats.teamID
                and TeamSeatMapping.seatID = BookedSeats.seatID.seatID
            )
        {
            TeamSeatMapping.seatID,
            TeamSeatMapping.teamID,
            TeamSeatMapping.monitorCount,
            BookedSeats.ID,
            BookedSeats.bookingDate,
            TeamSeatMapping.facility1,
            TeamSeatMapping.facility2,
            TeamSeatMapping.facility3
        // @Core.Computed case
        //     when
        //         exists(select from bookedSeats
        //         where
        //            bookedSeats.seatID.seatID = TeamSeatMapping.seatID
        //             and BookedSeats.teamID    = TeamSeatMapping.teamID
        //          and BookedSeats.bookingDate = ip_bookingDate )
        //         )
        //     //   and BookedSeats.bookingDate = ip_bookingDate )
        //     then
        //         'TRUE'
        //     else
        //         'FALSE'
        // end as bookedFlag
        };


    // entity getstatus          as
    //     select from TeamSeatMapping
    //     left outer join me.bookedSeats//(ip_teamID, ip_bookingDate)
    //         on TeamSeatMapping.teamID = bookedSeats.teamID
    //     {
    //         TeamSeatMapping.seatID,
    //         bookedSeats.bookingDate,
    //         TeamSeatMapping.teamID,
    //         TeamSeatMapping.facility1,
    //         TeamSeatMapping.facility2,
    //         TeamSeatMapping.facility3,
    //         TeamSeatMapping.monitorCount,
    //         @Core.Computed case
    //             when
    //                 exists(select from bookedSeats
    //                 where
    //                    bookedSeats.seatID.seatID = TeamSeatMapping.seatID
    //                     and BookedSeats.teamID    = TeamSeatMapping.teamID
    //                  and BookedSeats.bookingDate = ip_bookingDate )
    //                 )
    //             //   and BookedSeats.bookingDate = ip_bookingDate )
    //             then
    //                 'TRUE'
    //             else
    //                 'FALSE'
    //         end as bookedFlag

    // };


    //  @sap.applicable.path : 'quickBook'
    //  action quickBook();
    //  @sap.applicable.path : 'showAvailability'
    action showAvailability();
    //  @sap.applicable.path : 'updateBooking'
    action updateBooking();
    //  @sap.applicable.path : 'managerZone'
    //   action managerZone();
    //  @sap.applicable.path : 'seatMap'
    action seatMap();
    function getFreeSeat(teamID : String, bookingDate : Date) returns array of Allstatus;
}
