sap.ui.define(
    ["sap/ui/model/odata/v4/ODataModel",
        "sap/m/Token",
        "sap/ui/model/json/JSONModel"

    ],
    function (ODataModel, Token, JSONModel) {
        "use strict";

        function _getDateFormat(inputDate) {
            if (inputDate !== "")
                return (inputDate.getFullYear() + '-' + ('0' + (inputDate.getMonth() + 1)).slice(-2) + '-'
                    + ('0' + inputDate.getDate()).slice(-2));
            else
                return inputDate;
        }

        function _getUserDetails() {
            var Currentdata = [];
            var sFilterQuery = `employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}'`;
            $.get({
                url: "/seat-booking/TeamEmployeeMaster",
                headers: {
                    "x-csrf-token": "fetch"
                }, data: {
                    $filter: sFilterQuery
                },
                success: function (data, status, xhr) {
                    //  csrfToken = xhr.getResponseHeader("x-csrf-token");
                    Currentdata = data;
                }, async: false
            });

            if (Currentdata.value) {
                if (Currentdata.value[0]) {
                    return Currentdata.value[0];
                }
            }
        }

        // To book seat for employee!
        function BookSeat(monitorCount, ref) {
            // Check if any seat already booked for that day
            var modelRef = ref._controller.getView().getModel("modelDataShowA");
            var newDate = modelRef.getProperty("/Property/date");
            var teamID = modelRef.getProperty("/userDetails/teamID");
            var Currentdata = [];
            var sFilterQuery = `employeeID_employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}' and bookingDate eq ${newDate} and isDeleted eq false`;
            $.get({
                url: "/seat-booking/Booking",
                data: {
                    $filter: sFilterQuery
                },

                success: function (data) {
                    Currentdata = data;

                }, async: false
            });
            // else get free seat based on M count and book it. 
            if (Currentdata.value && Currentdata.value.length === 0) {

                Currentdata = [], sFilterQuery = undefined;
                var url = `/seat-booking/SeatStatus(ip_teamID='${teamID}',ip_date=${newDate})/Set`
                if (monitorCount) {
                    sFilterQuery = `booked_seat eq false and monitorCount eq ${parseInt(monitorCount)}`;
                }
                else { sFilterQuery = `booked_seat eq false`; }

                $.get({
                    url: url,
                    data: {
                        $filter: sFilterQuery
                    },
                    success: function (data, status, xhr) {
                        Currentdata = data;
                    }, async: false
                });

                if (Currentdata.value && Currentdata.value[0]) {
                    var freeSeat = Currentdata.value[0];
                    var data =
                    {
                        "attendance_attendanceStatus": "1",
                        "bookedBy_ID": sap.ushell.Container.getService("UserInfo").getId(),
                        "bookingDate": newDate,
                        "createdBy": sap.ushell.Container.getService("UserInfo").getId(),
                        "employeeID_employeeID_ID": sap.ushell.Container.getService("UserInfo").getId(),
                        "isGroupBooking": false,
                        "seatID_seatID": freeSeat.seatID,
                        "status_bookingStatus": "1",
                        "isDeleted": false,
                    }

                    $.post({
                        url: "/seat-booking/Booking",
                        headers: {
                            //  "x-csrf-token": csrfToken,
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(data),
                        success: function (data) {
                            sap.m.MessageToast.show(`Seat-${data.seatID_seatID} having ${monitorCount} monitor(s) is booked for you!`);
                            getSeatbasedOnFilter(ref);
                             ref._controller.getView().getModel().refresh();
                        }, async: false
                    });
                }
                else {
                    sap.m.MessageToast.show("No free Seat available with selected monitor count & date!");
                }
            }
            else {
                sap.m.MessageToast.show("You already have a booking for selected day!");
            }

        }


        function _getMyTeamSeatDetails(teamID, date, monitorCount) {

            var Currentdata = [], sFilterQuery;
            var url = `/seat-booking/SeatStatus(ip_teamID='${teamID}',ip_date=${date})/Set`
            if (monitorCount) {
                sFilterQuery = `booked_seat eq false and monitorCount eq ${parseInt(monitorCount)}`;
            }
            else { sFilterQuery = `booked_seat eq false`; }

            $.get({
                url: url,
                data: {
                    $filter: sFilterQuery
                },
                success: function (data, status, xhr) {
                    Currentdata = data;
                }, async: false
            });

            if (Currentdata.value) {
                // return Currentdata.value;
                var data =
                    [{
                        "M2": 0,
                        "M1": 0,
                        "M0": 0,
                    }];

                Currentdata.value.forEach(function (seat) {

                    switch (seat.monitorCount) {
                        case 0:
                            data[0].M0 += 1;
                            break;
                        case 1:
                            data[0].M1 += 1;
                            break;
                        case 2:
                            data[0].M2 += 1;
                            break;
                    }
                })
                return data;
            }
        }

        function getSeatbasedOnFilter(that) {
            var modelRef = that._controller.getView().getModel("modelDataShowA");
            var newDate = modelRef.getProperty("/Property/date");
            var monitorCount = modelRef.getProperty("/Property/monitorCountFilter");
            if (newDate) {
                var todaysDate = new Date();
                var formatedDate = _getDateFormat(todaysDate);

                if (formatedDate <= newDate) {
                    var SeatList = _getMyTeamSeatDetails(modelRef.getProperty("/userDetails/teamID"), newDate, monitorCount);
                    modelRef.setProperty("/Seats", SeatList);
                } else {
                    SeatList = [];
                    modelRef.setProperty("/Seats", SeatList);
                    sap.m.MessageToast.show("Please provide a valid future date to get the results.");
                }
            }
            else {
                SeatList = [];
                modelRef.setProperty("/Seats", SeatList); sap.m.MessageToast.show("Please provide a valid date to get the results.");
            }
        }


        return {

            showAvailablityCancelPress: function (oContext) {
                this._oDialogonshowAvailablity.close();

            },

            MonitorChange: function (oContext) {
                getSeatbasedOnFilter(this);
            },

            M2Press: function () {
                BookSeat('2', this);
            },
            M1Press: function () {
                BookSeat('1', this);
            },
            M0Press: function () {
                BookSeat('0', this);
            },

            OpenAvailabilityDialog: function (oContext) {
                var todaysDate = new Date();
                todaysDate.setDate(todaysDate.getDate() + 1)
                var NextDayDate = _getDateFormat(todaysDate);
                var userDetails = _getUserDetails();

                var Newdata = {
                    "Property": {
                        "date": NextDayDate,
                        "monitorCountFilter": "",
                    },
                    "userDetails": {
                        "employeeID_ID": userDetails.employeeID_ID,
                        "role_roleCode": userDetails.role_roleCode,
                        "teamID": userDetails.teamID
                    },
                    "Seats": [{}],
                };

                // Getting available Seats.. 
                Newdata.Seats = _getMyTeamSeatDetails(userDetails.teamID, NextDayDate, Newdata.Property.monitorCountFilter);


                var oView = this._controller.getView();
                var oNewChatModel = new sap.ui.model.json.JSONModel(Newdata);
                oView.setModel(oNewChatModel, "modelDataShowA");

                var oView = this._controller.getView();
                if (!this._oDialogonshowAvailablity) {
                    this._oDialogonshowAvailablity = sap.ui.xmlfragment(oView.getId(), "seatbookingui.ext.fragments.showAvailablity",
                        this);
                    oView.addDependent(this._oDialogonshowAvailablity);
                }
                this._oDialogonshowAvailablity.open();
            },

        };
    }
);