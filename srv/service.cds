using {app.schema_flexwork as me} from '../db/schema';

// @requires:'admin'
 service AdminService  @(impl : './adminService.js') {
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

// @requires:'admin'
service SeatBooking @(impl : './SeatBookingService.js') {
    entity Booking                                                   as projection on me.Booking;
    entity TeamSeatMapping                                           as projection on me.TeamSeatMapping;
    entity SAPOfficeData                                             as projection on me.SAPOfficeData;
    entity Teams                                                     as projection on me.Teams;
    entity TeamEmployeeMaster                                        as projection on me.TeamEmployeeMaster;
    entity Privileges                                                as projection on me.Privileges;
    entity BookingStatus                                             as projection on me.BookingStatus;
    entity AttendanceStatus                                          as projection on me.AttendanceStatus;
    entity DayCodes                                                  as projection on me.DayCodes;
    entity SeatMaster                                                as projection on me.SeatMaster;
    entity Users                                                     as projection on me.Users;
    entity TeamMemberRole                                            as projection on me.TeamMemberRoles;

    entity BookedSeats                                               as select from Booking {
        Booking.ID,
        Booking.employeeID.employeeID.ID as empID,
        Booking.seatID, Booking.bookedBy,
        Booking.bookingDate,
        Booking.dayCode,
        Booking.status,
        Booking.employeeID.teamID as teamID,
        Booking.employeeID.employeeID.name as EmpName,
        Booking.status.description as BookingStatusDesc,
        Booking.isDeleted as isDeleted
    } where Booking.isDeleted = false;


    entity TeamEmployeeMasterWithName                                as projection on TeamEmployeeMaster {
        TeamEmployeeMaster.employeeID.ID as employeeID, 
        TeamEmployeeMaster.role as role, 
        TeamEmployeeMaster.teamID as teamID,
        TeamEmployeeMaster.employeeID.name as employeeName, 
        TeamEmployeeMaster.role.description as roleDescription
    };

    entity EmployeeBookingStatus(ip_teamID : String, ip_date : Date) as
        select from TeamEmployeeMasterWithName {
            employeeID,
            employeeName,
            teamID,            
            @Core.Computed case
                when
                    exists(select from BookedSeats
                    where
                        BookedSeats.teamID          = TeamEmployeeMasterWithName.teamID
                        and BookedSeats.empID       = TeamEmployeeMasterWithName.employeeID
                        and BookedSeats.bookingDate = : ip_date                        
                    )
                then
                    'Booked'
                else
                    'Not Booked'
            end as BookingStatus : String
    }
    where
        teamID = : ip_teamID;


    entity SeatStatus(ip_teamID : String, ip_date : Date)            as
        select from TeamSeatMapping {
            *,
            @Core.Computed case
                when
                    exists(select from BookedSeats
                    where
                        BookedSeats.seatID.seatID   = TeamSeatMapping.seatID
                        and BookedSeats.teamID      = TeamSeatMapping.teamID
                        and BookedSeats.bookingDate = : ip_date                        
                    )
                then
                    true
                else
                    false
            end as booked_seat : Boolean
    }
    where
        teamID = : ip_teamID;

//    ''''
// entity Allstatus          as
//     select from TeamSeatMapping
//     left outer join BookedSeats
//         on(
//                 TeamSeatMapping.teamID = BookedSeats.teamID
//             and TeamSeatMapping.seatID = BookedSeats.seatID.seatID
//         )
//     {
//         TeamSeatMapping.seatID,
//         TeamSeatMapping.teamID,
//         TeamSeatMapping.monitorCount,
//         BookedSeats.ID,
//         BookedSeats.bookingDate,
//         TeamSeatMapping.facility1,
//         TeamSeatMapping.facility2,
//         TeamSeatMapping.facility3
//     };

// action showAvailability();
// action updateBooking();
// action seatMap();
}
