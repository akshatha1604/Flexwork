namespace app.schema_flexwork;

using {
    Country,
    managed,
    cuid,
    User
} from '@sap/cds/common';

type LocationID : String(13);
type UserID : String(12);
type TeamID : String(20);
type SeatID : String(15);
type DayCode : String(2);


entity Cities {
    key ID   : String(3);
        name : String;
};

entity Offices {
    key ID   : String(3);
        name : String;
};

entity Buildings {
    key ID   : String(3);
        name : String;
};

entity Users {
    key ID         : UserID;
        name       : String;
        locationID : LocationID; //Will be needed for Privileges
};

entity SAPOfficeData : managed {
    key locationID             : String(13);
        @readonly country      : Country;
        @readonly city         : Association to Cities;
        @readonly office       : Association to Offices;
        @readonly building     : Association to Buildings;
        @readonly block        : String(2);
        @readonly floor        : Integer;
        @readonly totalSeat    : Integer;
        @readonly unassignSeat : Integer;
        admin                  : Association to Users;
        Teams                  : Composition of many Teams
                                     on Teams.locationID = $self.locationID;
//    on $self.locationID = locationID;
};

entity Teams : managed {
    key teamID                   : TeamID;
        @readonly key locationID : LocationID;
        teamName                 : String(50);
        employeeCount            : Integer;
        maxSeatPercent           : Integer;
        manager                  : Association to Users;
        headManager              : Association to Users;
        createdAt                : Timestamp @cds.on.insert : $now;
        createdBy                : User      @cds.on.insert : $user;
        modifiedAt               : Timestamp @cds.on.insert : $now  @cds.on.update  : $now;
        modifiedBy               : User      @cds.on.insert : $user  @cds.on.update : $user;
        to_Seats                 : Composition of many TeamSeatMapping
                                       on to_Seats.teamID = $self.teamID;
// virtual teamName_ip : String(50);
// virtual teamID_ip   : TeamID;
};

entity TeamEmployeeMaster {
    key employeeID : Association to Users;
        teamID     : TeamID;
        role       : Association to TeamMemberRoles;
};

entity TeamMemberRoles {
    key roleCode    : String(2);
        description : String(20); //Manager, Member, Delegate
};

entity SeatMaster {
    key seatID     : SeatID;
        locationID : LocationID;
};

entity TeamSeatMapping {
    key seatID       : SeatID;
        locationID   : LocationID;
        teamID       : TeamID;
        monitorCount : Integer;
        facility1    : Integer;
        facility2    : Integer;
        facility3    : Integer;
};

entity Privileges {
    key UserID      : Association to Users;
        PrivilegeID : Integer enum {
            Full         = 01;
            Countrywise  = 02;
            Citywise     = 03;
            Officewise   = 04;
            Buildingwise = 05;
            Blockwise    = 06;
            Floorwise    = 07;
        }
};

entity Booking : cuid, managed {
    key seatID         : Association to TeamSeatMapping;
        employeeID     : Association to Users;
        bookedBy       : Association to Users;
        bookingDate    : Date;
        dayCode        : Association to DayCodes;
        status         : Association to BookingStatus;
        attendance     : Association to AttendanceStatus;
        isGroupBooking : Boolean;
        isDeleted      : Boolean;
};

entity BookingStatus {
    key bookingStatus : String(2); // 01 = Booked;     02 = Cancelled;     03 = Transferred;
        description   : String(20);
};

entity AttendanceStatus {
    key attendanceStatus : String(2); // 01 = present;     02 = absent;     03 = NA;
        description      : String(20);
};

entity DayCodes {
    key dayCode     : DayCode;
        fromTime    : Time;
        toTime      : Time;
        description : String(80);
};
