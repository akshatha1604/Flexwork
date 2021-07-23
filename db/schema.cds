namespace app.schema_flexwork;

using {
    Country,
    managed,
    cuid
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

entity SAPOfficeData {
    key locationID   : LocationID;
        country      : Country;
        city         : Association to Cities;
        office       : Association to Offices;
        building     : Association to Buildings;
        block        : String(2);
        floor        : Integer;
        totalSeat    : Integer;
        unassignSeat : Integer;
        admin        : Association to Users;
        Teams        : Association to many Teams
                           on $self.locationID = locationID;
};

entity Teams {
    key teamID         : TeamID;
    key locationID     : Association to SAPOfficeData;
        teamName       : String(50);
        employeeCount  : Integer;
        maxSeatPercent : Integer;
        manager        : Association to Users;
        headManager    : Association to Users;
        to_Seats       : Association to many TeamSeatMapping
                             on $self.locationID = locationID;
};

entity TeamEmployeeMaster {
    key employeeID : Association to many Users;
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
    key bookingID      : UUID;
        seatID         : SeatID;
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
