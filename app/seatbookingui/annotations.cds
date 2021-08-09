using SeatBooking as service from '../../srv/service';

annotate service.Booking with @odata.draft.enabled;

annotate service.Booking // header-level annotations
{
    seatID         @title : 'Seat ID';
    employeeID     @title : 'Booked For';
    bookedBy       @title : 'Booked By';
    bookingDate    @title : 'Booking Date';
    dayCode        @title : 'Timing';
    status         @title : 'Booking Status';
    attendance     @title : 'Attended(Y/N)';
    isGroupBooking @title : ' Group Booking(Y/N)';
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
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.acceptTravel',   Label  : '{i18n>AcceptTravel}'   },
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.rejectTravel',   Label  : '{i18n>RejectTravel}'   },
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.deductDiscount', Label  : '{i18n>DeductDiscount}' },
        {Value : seatID_seatID},
        {Value : employeeID_ID},
        {Value : bookedBy_ID},
        {Value : bookingDate},
        {Value : dayCode_dayCode},
        {Value : status_bookingStatus},    
        {Value : attendance_attendanceStatus},       
        {Value : isGroupBooking},    
        {Value : isDeleted}
    ]
   
);
