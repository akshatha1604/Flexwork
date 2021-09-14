using {app.schema_flexwork as me} from '../db/schema';
using {
    Country,
    managed,
    cuid,
    User,
    sap
} from '@sap/cds/common';

using AdminService as service from './service';
using SeatBooking as booking from './service';

// aspect managed {
//   createdAt     : Timestamp @cds.on.insert : $now;
//   createdBy     : User      @cds.on.insert : $user;
//   modifiedAt : Timestamp @cds.on.insert : $now  @cds.on.update : $now;
//   modifiedBy : User      @cds.on.insert : $user @cds.on.update : $user;
// }

annotate SeatBooking.Booking with {
    bookedBy   @Common : {
        Text            : bookedBy.name,
        TextArrangement : #TextOnly //#TextFirst
    };

    employeeID @Common : {
        Text            : employeeID.employeeID.name,
        TextArrangement : #TextFirst //#TextFirst
    };

    attendance @Common : {
        Text            : attendance.description,
        TextArrangement : #TextOnly //#TextFirst
    };

    status     @Common : {
        Text            : status.description,
        TextArrangement : #TextOnly //#TextFirst
    };
};

annotate service.Teams with {
    manager     @Common : {
        Text            : manager.name,
        TextArrangement : #TextFirst //#TextOnly

    //  ValueListWithFixedValues

    };

    headManager @Common : {
        Text            : headManager.name,
        TextArrangement : #TextFirst //#TextOnly
    //  ValueListWithFixedValues
    };

};

annotate service.SAPOfficeData with {
    admin    @Common : {
        Text            : admin.name,
        TextArrangement : #TextFirst //#TextOnly
    //  ValueListWithFixedValues
    };

    country  @Common : {
        Text            : country.descr,
        TextArrangement : #TextOnly
    //  ValueListWithFixedValues
    };

    city     @Common : {
        Text            : city.name,
        TextArrangement : #TextOnly
    //  ValueListWithFixedValues
    };

    office   @Common : {
        Text            : office.name,
        TextArrangement : #TextOnly
    //  ValueListWithFixedValues
    };

    building @Common : {
        Text            : building.name,
        TextArrangement : #TextOnly
    //  ValueListWithFixedValues
    };
};

annotate  booking.Booking with  {
    employeeID @Common : {
        FilterDefaultValue : 'I073083'
    }
};
