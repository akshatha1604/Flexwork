sap.ui.define(
    ["sap/ui/model/odata/v4/ODataModel",
        "sap/m/Token",
        "sap/ui/model/json/JSONModel"

    ],
    function (ODataModel, Token, JSONModel) {
        "use strict";
        return {

            ImageCancelPress: function (oContext) {
                this._oDialogonImage.close();
            },

            OpenImageDialog: function (oContext) {
                var oView = this._controller.getView();
                if (!this._oDialogonImage) {
                    this._oDialogonImage = sap.ui.xmlfragment(oView.getId(), "seatbookingui.ext.fragments.openImage",
                        this);
                    oView.addDependent(this._oDialogonImage);
                }
                this._oDialogonImage.open();
            },

            quickBooking: function (oContext) {
                sap.ui.core.BusyIndicator.show(0);
                var Currentdata;
                var MyDate = new Date();
                var MyDateString;
                var timeHours = MyDate.getHours();
                var myTeamID;
                //Check if time is more then 12.59 it will try to book for today else next day. 

                if (timeHours > 13) {
                    //Getting next day
                    MyDate.setDate(MyDate.getDate() + 1);
                }
                MyDateString = (MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-'
                    + ('0' + MyDate.getDate()).slice(-2));
                //Check if any booking already for that day.  
                var sFilterQuery = `employeeID_employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}' and bookingDate eq ${MyDateString} and isDeleted eq false`;
                $.get({
                    url: "/seat-booking/Booking",
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
                    if (Currentdata.value.length > 0) {
                        sap.m.MessageToast.show(`You already have a booking for '${MyDateString}'`);
                    }
                    else {
                        // Getting my team id. 
                        var sFilterQuery = `employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}'`;
                        $.get({
                            url: "/seat-booking/TeamEmployeeMaster",
                            data: {
                                $filter: sFilterQuery
                            },
                            success: function (data, status, xhr) {
                                Currentdata = data;
                            }, async: false
                        });
                        if (Currentdata.value) {
                            if (Currentdata.value.length > 0) {
                                myTeamID = Currentdata.value[0].teamID;

                                // Get free seats for my team for selected day
                                var url = `/seat-booking/SeatStatus(ip_teamID='${myTeamID}',ip_date=${MyDateString})/Set`;
                                //var sFilterQuery = `teamID eq '${myTeamID}'`;
                                $.get({
                                    url: url,
                                    success: function (data) {
                                        Currentdata = data;
                                    }, async: false
                                });
                                if (Currentdata.value) {
                                    if (Currentdata.value.length > 0) {

                                        var data =
                                        {
                                            "attendance_attendanceStatus": "1",
                                            "bookedBy_ID": sap.ushell.Container.getService("UserInfo").getId(),
                                            "bookingDate": MyDateString,
                                            "createdBy": sap.ushell.Container.getService("UserInfo").getId(),
                                            "employeeID_employeeID_ID": sap.ushell.Container.getService("UserInfo").getId(),
                                            "isGroupBooking": false,
                                            "seatID_seatID": Currentdata.value[0].seatID,
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
                                                sap.m.MessageToast.show(`Seat ID: ${data.seatID_seatID} is booked for you!`);
                                            }, async: false
                                        });

                                    }
                                }
                            }
                        }

                    }
                }
                this._controller.getView().getModel().refresh();
                sap.ui.core.BusyIndicator.hide();
            }
        };
    }
);