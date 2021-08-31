using SeatBooking as service from '../../srv/service';
using User as self from '@sap/cds/common';

annotate service.Booking // header-level annotations
{
    seatID         @title : 'Seat ID';
    employeeID     @title : 'Booked For';
    bookedBy       @title : 'Booked By';
    bookingDate    @title : 'Booking Date';
    dayCode        @title : 'Timing';
    status         @title : 'Booking Status';
    attendance     @title : 'Attended';
    isGroupBooking @title : 'Group Booking(Y/N)';
    isDeleted      @title : 'Deleted(Y/N)';
}

annotate service.Booking with @( // header-level annotations

    UI.HeaderInfo      : {
        TypeName       : 'Seat Booking',
        TypeNamePlural : 'Seat Bookings',
    //Title          : {Value : locationID}
    },

    UI.SelectionFields : [
        seatID_seatID,
        status_bookingStatus,
        employeeID_ID,
        bookedBy_ID,
        bookingDate,
        attendance_attendanceStatus,
        dayCode_dayCode,
        isGroupBooking,
        isDeleted
    ],

    UI.LineItem        : [
        {
            $Type  : 'UI.DataFieldForAction',
            Action : 'SeatBooking.quickBook',
            Label  : '{i18n>Quick Book}'
        },
        {
            $Type  : 'UI.DataFieldForAction',
            Action : 'SeatBooking.managerZone',
            Label  : '{i18n>ManagerZone}'
        },
        {
            $Type  : 'UI.DataFieldForAction',
            Action : 'SeatBooking.showAvailability',
            Label  : '{i18n>Show Availability}'
        },
        {
            $Type  : 'UI.DataFieldForAction',
            Action : 'SeatBooking.updateBooking',
            Label  : '{i18n>Update Booking}'
        },
        {
            $Type  : 'UI.DataFieldForAction',
            Action : 'SeatBooking.seatMap',
            Label  : '{i18n>View Seat Map}'
        },

        {Value : seatID_seatID},
        {Value : employeeID_ID},
        {Value : bookedBy_ID},
        {Value : bookingDate},
        {Value : dayCode_dayCode},
        {Value : status_bookingStatus},
        {Value : attendance_attendanceStatus},
        {Value : isGroupBooking},
        {Value : isDeleted}
    ],
) {
    bookedBy   @(Common : {ValueList : {
        Label          : '{i18n>BookedBy}',
        CollectionPath : 'Users',
        Parameters     : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : 'bookedBy_ID',
                ValueListProperty : 'ID'
            },
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'name'
            },
        ]
    }});

    employeeID @(Common : {ValueList : {
        Label          : '{i18n>BookedFor}',
        CollectionPath : 'Users',
        Parameters     : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : 'employeeID_ID',
                ValueListProperty : 'ID'
            },
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'name'
            },
        ]
    }});

  bookingStatus @(Common : {ValueList : {
        Label          : 'Booking Status',
        CollectionPath : 'BookingStatus',
        Parameters     : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : 'status_bookingStatus',
                ValueListProperty : 'bookingStatus'
            },
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'description'
            },
        ]
    }});

attendance @(Common : {ValueList : {
        Label          : 'Attendence Status',
        CollectionPath : 'AttendanceStatus',
        Parameters     : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : 'attendance_attendanceStatus',
                ValueListProperty : 'attendanceStatus'
            },
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'description'
            },
        ]
    }});

dayCode @(Common : {ValueList : {
        Label          : 'Timing',
        CollectionPath : 'DayCodes',
        Parameters     : [
            {
                $Type             : 'Common.ValueListParameterInOut',
                LocalDataProperty : 'dayCode_dayCode',
                ValueListProperty : 'dayCode'
            },
            {
                $Type             : 'Common.ValueListParameterFilterOnly',                
                ValueListProperty : 'fromTime'
            },
            {
                $Type             : 'Common.ValueListParameterFilterOnly',                
                ValueListProperty : 'toTime'
            },             
            {
                $Type             : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'description'
            },
        ]
    }});

employeeID @(Common : {FilterDefaultValue : 'I073083'});//$self.User.User});
isDeleted @(Common : {FilterDefaultValue : 0});

// bookingDate @(Common : {FilterDefaultValue : 'se'});    
};
