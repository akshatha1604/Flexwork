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

        return {

            UpdateBtnHandling: function (oContext, aselectedRow) {
                if (aselectedRow && aselectedRow.length === 1) {
                    var selectedData = aselectedRow[0].getObject(aselectedRow[0].getPath());
                    if (!selectedData.isDeleted) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                return false;
            },

            OpenUpdateBookingDialog: function (oContext, aselectedRow) {
                if (aselectedRow && aselectedRow.length === 1) {

                    var selectedData = aselectedRow[0].getObject(aselectedRow[0].getPath());

                    var todaysDate = new Date();
                    var formatedDate = _getDateFormat(todaysDate);

                    if (formatedDate > selectedData.bookingDate) {
                        sap.m.MessageToast.show("Past date entry cannot be modified!");
                    }
                    else {
                        var userDetails = _getUserDetails();
                        var Newdata = {
                            "radiobutton": [{
                                "type": "Cancel Booking"
                            }, {
                                "type": "Assign to other team Member"
                            }, {
                                "type": "Extend Booking(in-process)"
                            }],
                            "Property": {
                                "Title": `Update Booking`,
                                "SelectedSeat": selectedData.seatID_seatID,
                                "BookedBy": selectedData.bookedBy_ID,
                                "BookingDate": selectedData.bookingDate,
                                "visibleAssignToElse": false,
                                "index": 0,
                                "bookingForOtherEmp": ''

                            },
                            "userDetails": {
                                "employeeID_ID": userDetails.employeeID_ID,
                                "role_roleCode": userDetails.role_roleCode,
                                "teamID": userDetails.teamID
                            },
                            "MyTeamEmpList": [],
                            "selectedRow": selectedData
                        };
                        var oView = this._controller.getView();
                        var oEmpModel = new sap.ui.model.json.JSONModel(Newdata);
                        oView.setModel(oEmpModel, "modelData");
                        if (!this._oDialogonUpdateBooking) {
                            this._oDialogonUpdateBooking = sap.ui.xmlfragment(oView.getId(), "seatbookingui.ext.fragments.updateBooking",
                                this);
                            oView.addDependent(this._oDialogonUpdateBooking);
                        }
                        this._oDialogonUpdateBooking.open();
                    }
                }
                else {
                    sap.m.MessageToast.show("Select an entry to update");

                }
            },

            saveData: function () {
                var that = this, Currentdata = [];
                var modelRef = this._controller.getView().getModel("modelData");
                var selectedRow = modelRef.getProperty("/selectedRow");
                switch (modelRef.getProperty("/Property/index")) {
                    case 0:

                        //Logic for delete


                        if (selectedRow.isDeleted === false
                            && (selectedRow.employeeID_employeeID_ID === sap.ushell.Container.getService("UserInfo").getId()
                                || selectedRow.bookedBy_ID === sap.ushell.Container.getService("UserInfo").getId())
                        ) {

                            var data =
                            {
                                "attendance_attendanceStatus": selectedRow.attendance_attendanceStatus,
                                "bookedBy_ID": selectedRow.bookedBy_ID,
                                "bookingDate": selectedRow.bookingDate,
                                "createdBy": sap.ushell.Container.getService("UserInfo").getId(),
                                "employeeID_employeeID_ID": selectedRow.employeeID_employeeID_ID,
                                "isGroupBooking": false,
                                "seatID_seatID": selectedRow.seatID_seatID,
                                "status_bookingStatus": "2",
                                "isDeleted": true,
                                "ID": selectedRow.ID,
                            }


                            $.ajax({
                                url: `/seat-booking/Booking(ID=${selectedRow.ID},seatID_seatID='${selectedRow.seatID_seatID}')`,
                                type: 'PUT',
                                headers: {

                                    "Content-Type": "application/json"
                                },
                                data: JSON.stringify(JSON.parse(JSON.stringify(data))),
                                success: function (data) {
                                    sap.m.MessageToast.show(`Booking marked as deleted!`);
                                    that._oDialogonUpdateBooking.close();
                                    that._controller.getView().getModel().refresh();
                                }, error: function (data, status) {

                                }, async: false
                            });
                        }
                        else { sap.m.MessageToast.show(`Booking cannot be deleted!`); }

                        break;

                    case 1:
                        var selectedEmp = modelRef.getProperty("/Property/bookingForOtherEmp");
                        if (!selectedEmp) { sap.m.MessageToast.show(`Select the employee!`); }
                        else {
                            // Check if same user have any active booking already for same day. 
                            var Currentdata = [];
                            var sFilterQuery = `employeeID_employeeID_ID eq '${selectedEmp}' and bookingDate eq ${selectedRow.bookingDate} and isDeleted eq false`;
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

                                var Newdata =
                                {
                                    "attendance_attendanceStatus": "1",
                                    "bookedBy_ID": sap.ushell.Container.getService("UserInfo").getId(),
                                    "bookingDate": selectedRow.bookingDate,
                                    "createdBy": sap.ushell.Container.getService("UserInfo").getId(),
                                    "employeeID_employeeID_ID": selectedEmp,
                                    "isGroupBooking": false,
                                    "seatID_seatID": selectedRow.seatID_seatID,
                                    "status_bookingStatus": "1",
                                    "isDeleted": false,
                                }

                                $.post({
                                    url: "/seat-booking/Booking",
                                    headers: {
                                        //  "x-csrf-token": csrfToken,
                                        "Content-Type": "application/json"
                                    },
                                    data: JSON.stringify(Newdata),
                                    success: function (data) {
                                        sap.m.MessageToast.show("Selected seat is transfered!");
                                        // Marking existing booking deleted

                                        Newdata.isDeleted = true;
                                        Newdata.status_bookingStatus = "3";
                                        Newdata.attendance_attendanceStatus = selectedRow.attendance_attendanceStatus;
                                        Newdata.bookedBy_ID = selectedRow.bookedBy_ID;
                                        Newdata.bookingDate = selectedRow.bookingDate;
                                        Newdata.employeeID_employeeID_ID = selectedRow.employeeID_employeeID_ID;

                                        $.ajax({
                                            url: `/seat-booking/Booking(ID=${selectedRow.ID},seatID_seatID='${selectedRow.seatID_seatID}')`,
                                            type: 'PUT',
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            data: JSON.stringify(JSON.parse(JSON.stringify(Newdata))),
                                            success: function (data) {
                                                //  sap.m.MessageToast.show(`Booking marked as transferred!`);
                                                that._oDialogonUpdateBooking.close();
                                                that._controller.getView().getModel().refresh();
                                            }, error: function (data, status) {

                                            }, async: false
                                        });



                                    }, async: false
                                });
                            }
                            else {
                                sap.m.MessageToast.show("Selected teammate already have a booking for same day!");
                            }
                        }
                        break;
                }

            },
            ClosePopup: function () {
                this._oDialogonUpdateBooking.close();
            },

            BookingTypeSelection: function () {
                var modelRef = this._controller.getView().getModel("modelData");
                if (modelRef.getProperty("/Property/index") === 1) {
                    modelRef.setProperty("/Property/visibleAssignToElse", true);

                    if (modelRef.getProperty("/MyTeamEmpList").length === 0) {

                        var MyTeamEmpList = [], Currentdata = [], sFilterQuery;
                        var url = `/seat-booking/TeamEmployeeMasterWithName`

                        var sFilterQuery = `teamID eq '${modelRef.getProperty("/userDetails/teamID")}'`;
                        $.get({
                            url: url,
                            data: {
                                $filter: sFilterQuery
                            },
                            success: function (data) {
                                Currentdata = data;
                            }, async: false
                        });

                        if (Currentdata.value) {
                            if (Currentdata.value.length) {
                                MyTeamEmpList = Currentdata.value.filter(function (item) {
                                    return item.employeeID !== sap.ushell.Container.getService("UserInfo").getId()
                                })
                                //  MyTeamEmpList = Currentdata.value;
                            }
                        }
                        modelRef.setProperty("/MyTeamEmpList", MyTeamEmpList);
                    }
                }
                else
                    modelRef.setProperty("/Property/visibleAssignToElse", false);

            }
        };
    }
);