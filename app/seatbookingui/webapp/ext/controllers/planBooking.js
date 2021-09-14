sap.ui.define(
    ["sap/ui/model/odata/v4/ODataModel",
        "sap/m/Token",
        "sap/ui/model/json/JSONModel"

    ],
    function (ODataModel, Token, JSONModel) {
        "use strict";

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

        function _getDateFormat(inputDate) {
            if (inputDate !== "")
                return (inputDate.getFullYear() + '-' + ('0' + (inputDate.getMonth() + 1)).slice(-2) + '-'
                    + ('0' + inputDate.getDate()).slice(-2));
            else
                return inputDate;
        }

        function getSeatbasedOnFilter(that) {
            var modelRef = that._controller.getView().getModel("modelData");
            var newDate = modelRef.getProperty("/Property/individualBooking");
            var monitorCount = modelRef.getProperty("/Property/monitorCountFilter");
            that._controller.getView().byId("tabele1").removeSelections();
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


        function _getEmployeeNameByID(userid) {
            var Currentdata;
            var sFilterQuery = `ID eq '${userid}'`;
            $.get({
                url: "/seat-booking/Users",
                data: {
                    $filter: sFilterQuery
                },
                success: function (data) {
                    // csrfToken = xhr.getResponseHeader("x-csrf-token");
                    Currentdata = data;
                }, async: false
            });
            if (Currentdata.value[0])
                return Currentdata.value[0];
        }

        function _getMyTeamMatesBooking(teamID, date) {
            var Currentdata = [];
            var sFilterQuery = `teamID eq '${teamID}'`;
            var url = `/seat-booking/EmployeeBookingStatus(ip_teamID='${teamID}',ip_date=${date})/Set`
            $.get({
                url: url,
                // headers: {
                //     //   "x-csrf-token": "fetch"
                // }, data: {
                //     $filter: sFilterQuery
                // },
                success: function (data, status, xhr) {
                    // csrfToken = xhr.getResponseHeader("x-csrf-token");
                    Currentdata = data;
                }, async: false
            });

            if (Currentdata.value) {
                return Currentdata.value;
            }
        }

        function _getMyTeamSeatDetails(teamID, date, monitorCount) {

            var Currentdata = [], sFilterQuery;
            var url = `/seat-booking/SeatStatus(ip_teamID='${teamID}',ip_date=${date})/Set`
            if (monitorCount) {
                sFilterQuery = `monitorCount eq ${parseInt(monitorCount)}`;
                $.get({
                    url: url,
                    data: {
                        $filter: sFilterQuery
                    },
                    success: function (data, status, xhr) {
                        Currentdata = data;
                    }, async: false
                });
            }
            else {
                $.get({
                    url: url,
                    success: function (data, status, xhr) {
                        Currentdata = data;
                    }, async: false
                });
            }
            if (Currentdata.value) {
                return Currentdata.value;
            }
        }


        return {

            openPlanBookingDialog: function (oContext) {
                sap.ui.core.BusyIndicator.show(0);

                var userDetails = _getUserDetails();

                var todaysDate = new Date();
                todaysDate.setDate(todaysDate.getDate() + 1)
                var NextDayDate = _getDateFormat(todaysDate);

                var Newdata = {
                    "radiobutton": [{
                        "type": "Individual Booking"
                    }, {
                        "type": "Group Booking(*visible to Manager/lead role)"
                    }],
                    "Property": {
                        "index": 0,
                        "MyBooking": true,
                        "OnBehalfBooking": false,
                        "GroupBooking": false,
                        "GroupBookingDate": NextDayDate,
                        "individualBooking": NextDayDate,
                        "monitorCountFilter": "",
                        "bookingForOtherTitle": "Booking Seat for others",
                        "bookingForOtherEmp": ''
                    },
                    "userDetails": {
                        "employeeID_ID": userDetails.employeeID_ID,
                        "role_roleCode": userDetails.role_roleCode,
                        "teamID": userDetails.teamID
                    },
                    "Seats": [{
                        // // "Date": "12.06.2021",
                        // "seatID": "BLR04-2F-001",
                        // "monitorCount": "2",
                        // "facility1": "power,ext",
                        //  "facility2": "power,ext",
                        // // "available": "Full Day",
                        // // "Seat": "11"
                    }],
                    "empList": [],
                    "MyTeamEmpList": []
                };

                // Getting Seat Details:
                Newdata.Seats = _getMyTeamSeatDetails(userDetails.teamID, NextDayDate, Newdata.Property.monitorCountFilter);

                var oView = this._controller.getView();
                var oNewChatModel = new sap.ui.model.json.JSONModel(Newdata);
                oView.setModel(oNewChatModel, "modelData");

                if (!this._oDialogonPlanBooking) {

                    this._oDialogonPlanBooking = sap.ui.xmlfragment(oView.getId(), "seatbookingui.ext.fragments.planBooking",
                        this);

                    oView.addDependent(this._oDialogonPlanBooking);
                }
                this._oDialogonPlanBooking.open();
                sap.ui.core.BusyIndicator.hide();

            },

            onSelectChange: function (oContext) {
                alert("search called");
            },

            PlanBookingCancelPress: function () {
                this._oDialogonPlanBooking.close();
            },


            BookingTypeSelection: function (oEvent) {
                var modelRef = this._controller.getView().getModel("modelData");
                var index = modelRef.getProperty("/Property/index");
                var userDetails = modelRef.getProperty("/userDetails");
                if (userDetails.role_roleCode !== "03") {
                    if (index === 0) {
                        modelRef.setProperty("/Property/MyBooking", true);
                        modelRef.setProperty("/Property/OnBehalfBooking", false);
                        modelRef.setProperty("/Property/GroupBooking", false);
                    } else if (index === 1) {
                        modelRef.setProperty("/Property/MyBooking", false);
                        modelRef.setProperty("/Property/OnBehalfBooking", false);
                        modelRef.setProperty("/Property/GroupBooking", true);

                        if (modelRef.getProperty("/empList").length === 0) {
                            var newDate = modelRef.getProperty("/Property/GroupBookingDate");
                            if (newDate)
                                var todaysDate = new Date();
                            var formatedDate = _getDateFormat(todaysDate);

                            if (formatedDate <= newDate) {
                                var employeeList = _getMyTeamMatesBooking(userDetails.teamID, newDate);
                                modelRef.setProperty("/empList", employeeList);
                            }
                            else {
                                employeeList = [];
                                modelRef.setProperty("/empList", employeeList);
                            }
                        }


                    }
                }
                else {
                    modelRef.setProperty("/Property/MyBooking", true);
                    modelRef.setProperty("/Property/OnBehalfBooking", false);
                    modelRef.setProperty("/Property/GroupBooking", false);
                    modelRef.setProperty("/Property/index", 0);
                    sap.m.MessageToast.show("This feature is not available yet for members");
                }
            },
            DialogBookPress: function (oContext) {
                var that = this;
                var selectedItem = this._controller.getView().byId("tabele1").getSelectedItem();
                if (selectedItem) {
                    var selectedRow = selectedItem.getBindingContext("modelData").getObject();
                    var modelRef = this._controller.getView().getModel("modelData");
                    var newDate = modelRef.getProperty("/Property/individualBooking");

                    // Check if same user have any active booking already for same day. 
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

                    if (Currentdata.value && Currentdata.value.length === 0) {

                        var data =
                        {
                            "attendance_attendanceStatus": "1",
                            "bookedBy_ID": sap.ushell.Container.getService("UserInfo").getId(),
                            "bookingDate": newDate,
                            "createdBy": sap.ushell.Container.getService("UserInfo").getId(),
                            "employeeID_employeeID_ID": sap.ushell.Container.getService("UserInfo").getId(),
                            "isGroupBooking": false,
                            "seatID_seatID": selectedRow.seatID,
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
                                sap.m.MessageToast.show("Selected seat is booked for you!");
                                getSeatbasedOnFilter(that);

                            }, async: false
                        });
                    }
                    else {
                        sap.m.MessageToast.show("You already have a booking for same day!");
                    }
                }
                else {
                    sap.m.MessageToast.show("Select a free seat to book!!");
                }
            },

            SearchGroupBooking: function (oContext) {
                var modelRef = this._controller.getView().getModel("modelData");
                var newDate = modelRef.getProperty("/Property/GroupBookingDate");
                if (newDate) {
                    var todaysDate = new Date();
                    var formatedDate = _getDateFormat(todaysDate);

                    if (formatedDate <= newDate) {
                        var employeeList = _getMyTeamMatesBooking(modelRef.getProperty("/userDetails/teamID"), newDate);
                        modelRef.setProperty("/empList", employeeList);
                    } else {
                        employeeList = [];
                        modelRef.setProperty("/empList", employeeList);
                        sap.m.MessageToast.show("Please provide a valid future date to get the results.");
                    }
                }
                else {
                    employeeList = [];
                    modelRef.setProperty("/empList", employeeList); sap.m.MessageToast.show("Please provide a valid date to get the results.");
                }
            },

            GroupBooking: function (oContext) {
                sap.m.MessageToast.show("Booking is made for selected colleagues");
            },

            searchSeatFilter: function (oContext) {
                var modelRef = this._controller.getView().getModel("modelData");
                var newDate = modelRef.getProperty("/Property/individualBooking");
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

            },

            MonitorChange: function () {
                getSeatbasedOnFilter(this);
            },

            BookedByPress: function (oContext) {
                var bookedSeatID = oContext.getSource().getBindingContext("modelData").getObject().seatID;
                var modelRef = this._controller.getView().getModel("modelData");
                var newDate = modelRef.getProperty("/Property/individualBooking");

                // Get name of person. 
                var Currentdata = [], sFilterQuery;
                var url = `/seat-booking/BookedSeats`

                var sFilterQuery = `seatID_seatID eq '${bookedSeatID}' and bookingDate eq ${newDate}`;
                $.get({
                    url: url,
                    data: {
                        $filter: sFilterQuery
                    },
                    success: function (data, status, xhr) {
                        Currentdata = data;
                    }, async: false
                });

                if (Currentdata.value && Currentdata.value[0].EmpName) {
                    sap.m.MessageToast.show(`Clicked seat-'${Currentdata.value[0].seatID_seatID}' is booked for '${Currentdata.value[0].EmpName}'.`);
                }
            },

            BookingOthers: function () {
                var that = this;
                var selectedItem = this._controller.getView().byId("tabele1").getSelectedItem();
                if (selectedItem) {
                    var selectedRow = selectedItem.getBindingContext("modelData").getObject();
                    var modelRef = this._controller.getView().getModel("modelData");
                    var newDate = modelRef.getProperty("/Property/individualBooking");
                    var emp = modelRef.getProperty("/Property/bookingForOtherEmp");
                    if (emp) {
                        // Check if same user have any active booking already for same day. 
                        var Currentdata = [];
                        var sFilterQuery = `employeeID_employeeID_ID eq '${emp}' and bookingDate eq ${newDate} and isDeleted eq false`;
                        $.get({
                            url: "/seat-booking/Booking",
                            data: {
                                $filter: sFilterQuery
                            },

                            success: function (data) {
                                Currentdata = data;

                            }, async: false
                        });

                        if (Currentdata.value && Currentdata.value.length === 0) {

                            var data =
                            {
                                "attendance_attendanceStatus": "1",
                                "bookedBy_ID": sap.ushell.Container.getService("UserInfo").getId(),
                                "bookingDate": newDate,
                                "createdBy": sap.ushell.Container.getService("UserInfo").getId(),
                                "employeeID_employeeID_ID": emp,
                                "isGroupBooking": false,
                                "seatID_seatID": selectedRow.seatID,
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
                                    sap.m.MessageToast.show("Selected seat is booked!");
                                      that._oDialogonPlanBookingOthers.close();
                                    getSeatbasedOnFilter(that);

                                }, async: false
                            });
                        }
                        else {
                            sap.m.MessageToast.show("Selected teammate already have a booking for same day!");
                        }
                    }
                    else {
                        sap.m.MessageToast.show("Select a teammate to book!!");
                    }
                }
                else {
                    sap.m.MessageToast.show("Select a free seat to book!!");
                }
            },
            BookingOtherCancelPress: function (oContext) {
                this._oDialogonPlanBookingOthers.close();
            },

            DialogBookOtherPress: function (oContext) {
                var selectedItem = this._controller.getView().byId("tabele1").getSelectedItem();
                var modelRef = this._controller.getView().getModel("modelData");
                if (selectedItem) {
                    var selectedRow = selectedItem.getBindingContext("modelData").getObject();

                    modelRef.setProperty("/Property/bookingForOtherTitle", `Booking Seat: ${selectedRow.seatID}`);
                    var oView = this._controller.getView();
                    var MyTeamEmpList = [], Currentdata = [], sFilterQuery;
                    var url = `/seat-booking/TeamEmployeeMasterWithName`

                    var sFilterQuery = `teamID eq '${modelRef.getProperty("/userDetails/teamID")}'`;
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
                        if (Currentdata.value.length) {
                            MyTeamEmpList = Currentdata.value;
                        }
                    }

                    modelRef.setProperty("/MyTeamEmpList", MyTeamEmpList);

                    if (!this._oDialogonPlanBookingOthers) {

                        this._oDialogonPlanBookingOthers = sap.ui.xmlfragment(oView.getId(), "seatbookingui.ext.fragments.PlanBookingOther",
                            this);

                        oView.addDependent(this._oDialogonPlanBookingOthers);
                    }
                    this._oDialogonPlanBookingOthers.open();
                }
                else
                    sap.m.MessageToast.show('Select a free seat to book');
            },

            onTableSelectionChangeMyBooking: function (oContext) {
                if (oContext.getParameter('selected')) {
                    if (oContext.getParameter('listItem').getBindingContext('modelData').getObject().booked_seat) {
                        sap.m.MessageToast.show('Selected seat is already booked and cannot be selected');
                        oContext.getParameter('listItem').setSelected(false);
                    }
                }

            },

            onTableSelectionChangeGrpBooking: function (oContext) {


            },




        };
    }
);