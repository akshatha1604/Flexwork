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


        return {

            openPlanBookingDialog: function (oContext) {
                sap.ui.core.BusyIndicator.show(0);

                var userDetails = _getUserDetails();

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
                        "GroupBookingDate": ""
                    },
                    "userDetails": {
                        "employeeID_ID": userDetails.employeeID_ID,
                        "role_roleCode": userDetails.role_roleCode,
                        "teamID": userDetails.teamID
                    },
                    "Seats": [{
                        "Date": "12.06.2021",
                        "SeatNo": "BLR04-2F-001",
                        "monitors": "2",
                        "others": "power,ext",
                        "available": "Full Day",
                        "Seat": "11"
                    }, {
                        "Date": "12.06.2021",
                        "SeatNo": "BLR04-2F-004",
                        "monitors": "2",
                        "others": "power,ext",
                        "available": "1st Half Day",
                        "Seat": "11"
                    }, {
                        "Date": "12.06.2021",
                        "SeatNo": "BLR04-2F-008",
                        "monitors": "1",
                        "others": "power,ext",
                        "available": "1st Half Day",
                        "Seat": "11"
                    }, {
                        "Date": "12.06.2021",
                        "SeatNo": "BLR04-2F-001",
                        "monitors": "2",
                        "others": "power,ext",
                        "available": "Full Day",
                        "Seat": "9"
                    }, {
                        "Date": "13.06.2021",
                        "SeatNo": "BLR04-2F-001",
                        "monitors": "1",
                        "others": "power,ext",
                        "available": "Full Day",
                        "Seat": "9"
                    }],
                    "empList": [
                        // "EmpName": "Sara Mohanti",
                        // "BookingStatus": "Not Booked"
                    ]
                };
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
                            var employeeList = _getMyTeamMatesBooking(userDetails.teamID, modelRef.getProperty("/Property/GroupBookingDate"));
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
            }

            // openPlanBookingDialog: function (oContext) {
            // //    var contextData = oContext.getObject(oContext.sPath);

            //  //   var locationID = contextData.locationID_locationID;
            //  //   var teamID = contextData.teamID;

            //     //   var title = `Allocate new seats for location -${locationID} & Team -${teamID}`;

            //     var Newdata = {
            //         "radiobutton": [{
            //             "Seat": `Seat Range(0001-0005)`
            //         }, {
            //             "Seat": "Multiple seats, comma separated(0001,0002)"
            //         }, {
            //             "Seat": "Single Seat(0001)"
            //         }],
            //         "Property": {
            //             "inputField": "",
            //             "SelectedIndex": -1,
            //             "locationID": locationID,
            //             "teamID": teamID,
            //             "title": `Allocate new seats for location- ${locationID} & Team- ${teamID}`,
            //             "placeHolder": "Select desired format and provide data"
            //         }
            //     };
            //     var oModel = new sap.ui.model.json.JSONModel(Newdata);
            //     this._controller.getView().setModel(oModel, "NewModel");

            //     var oView = this._controller.getView();

            //     if (!this._oDialogonAddSeats) {

            //         this._oDialogonAddSeats = sap.ui.xmlfragment(oView.getId(), "adminui.ext.fragments.addSeats",
            //             this);

            //         oView.addDependent(this._oDialogonAddSeats);
            //     }
            //     this._oDialogonAddSeats.open();
            // },

            // AddSeatCancelPress: function () {
            //     this._oDialogonAddSeats.close();
            // },
            // onCustomValueSelected: function () {
            //     var oData = this._controller.getView().getModel("NewModel").getData();
            //     var placeHolder;
            //     switch (oData.Property.SelectedIndex) {
            //         case -1:
            //             sap.m.MessageToast.show("No option selected, kindly select an option above");
            //             break;
            //         case 0:
            //             placeHolder = "Enter the only seat no. (Exp: 0001-9999) as the currently selected format.";
            //             break;
            //         case 1:
            //             placeHolder = "Enter the only seat no. (Exp: 0001,0002,..) as the currently selected format."
            //             break;
            //         case 2:
            //             placeHolder = "Enter the only seat no.(Exp: 0001) as the currently selected format.";
            //             break;
            //     }
            //     this._controller.getView().getModel("NewModel").setProperty("/Property/placeHolder", placeHolder);
            // },

            // postDataToDB: function (modelData, seatNos) {

            //     var csrfToken, Currentdata = [], newData = {
            //         "seatID": "",
            //         "locationID": "",
            //         "teamID": "",
            //         "monitorCount": "",
            //         "facility1": "",
            //         "facility2": "",
            //         "facility3": ""
            //     };
            //     $.get({
            //         url: "/admin/TeamSeatMapping",
            //         headers: {
            //             "x-csrf-token": "fetch"
            //         },
            //         success: function (data, status, xhr) {
            //             csrfToken = xhr.getResponseHeader("x-csrf-token");
            //             Currentdata = data;
            //             // if (status === that.Constants.STATUS.SUCCESS && data &&
            //             // 	data.value && data.value.length !== 0) {
            //             // 	resolve(data.value);
            //             // } else {
            //             // 	reject();
            //             // }
            //         }, async: false
            //     });
            //     if (Currentdata !== '') {
            //         //Check given seat no. in current data
            //         newData = Currentdata.value[0];
            //         newData.seatID = seatNos[0];
            //     }

            //     $.post({
            //         url: "/admin/TeamSeatMapping",
            //         headers: {
            //             "x-csrf-token": csrfToken,
            //             "Content-Type": "application/json"
            //         },
            //         data: JSON.stringify(newData),
            //         success: function (data) {
            //         }, async: false
            //     });
            // },


            // SaveSeatPress: function (oContext, aSelectedContexts) {
            //     var seatNo;
            //     var seatNos = [];
            //     var that = this;
            //     var newData = {
            //         "seatID": "",
            //         "locationID": "",
            //         "teamID": "",
            //         "monitorCount": 0,
            //         "facility1": 0,
            //         "facility2": 0,
            //         "facility3": 0
            //     };

            //     var oData = this._controller.getView().getModel("NewModel").getData();
            //     newData.locationID = oData.Property.locationID;
            //     newData.teamID = oData.Property.teamID;
            //     if (oData.Property.inputField !== "") {
            //         switch (oData.Property.SelectedIndex) {
            //             case -1:
            //                 sap.m.MessageToast.show("No option selected, kindly select and try again");
            //                 break;
            //             case 0:
            //                 if (oData.Property.inputField.includes("-")) {
            //                     //add logic
            //                     sap.m.MessageToast.show("Development in-progress, Please use single seat option");
            //                  //   this._oDialogonAddSeats.close();
            //                 } else {
            //                     //add logic
            //                     sap.m.MessageToast.show("Selected format and input is not same, Please retry in correct format");
            //                 }
            //                 break;
            //             case 1:
            //                 if (oData.Property.inputField.includes(",")) {
            //                     //add logic
            //                      sap.m.MessageToast.show("Development in-progress, Please use single seat option");
            //                   //  this._oDialogonAddSeats.close();
            //                 } else {
            //                     //add logic
            //                     sap.m.MessageToast.show("Selected format and input is not same, Please retry in correct format!");
            //                 }
            //                 break;
            //             case 2:
            //                 if (oData.Property.inputField.length === 4) {
            //                     seatNo = oData.Property.locationID + oData.Property.inputField;
            //                     seatNos.push(seatNo);

            //                     //   this.postDataToDB(oData, seatNos);

            //                     //Get a call to find if given seat is valid seat like below. 
            //                     var csrfToken, Currentdata = [], newData;
            //                     var sFilterQuery = `seatID eq '${seatNo}'`;
            //                     $.get({
            //                         url: "/admin/TeamSeatMapping",
            //                         headers: {
            //                             "x-csrf-token": "fetch"
            //                         }, data: {
            //                             $filter: sFilterQuery
            //                         },
            //                         success: function (data, status, xhr) {
            //                             csrfToken = xhr.getResponseHeader("x-csrf-token");
            //                             Currentdata = data;

            //                         }, async: false
            //                     });
            //                     if (Currentdata.value.length !== 0) {
            //                         var seatAlreadyAdded = Currentdata.value.find(function (item) {
            //                             return item.seatID === seatNo;
            //                         });

            //                     }
            //                     if (!seatAlreadyAdded) {
            //                         newData.seatID = seatNos[0];

            //                         $.post({
            //                             url: "/admin/TeamSeatMapping",
            //                             headers: {
            //                                 "x-csrf-token": csrfToken,
            //                                 "Content-Type": "application/json"
            //                             },
            //                             data: JSON.stringify(newData),
            //                             success: function (data) {
            //                                 //   csrfToken = xhr.getResponseHeader("x-csrf-token");
            //                                 //   Currentdata = data;
            //                                 // if (status === that.Constants.STATUS.SUCCESS && data &&
            //                                 // 	data.value && data.value.length !== 0) {
            //                                 // 	resolve(data.value);
            //                                 // } else {
            //                                 // 	reject();
            //                                 // }
            //                                 sap.m.MessageToast.show("Seat added successfully");
            //                             }, async: false
            //                         });


            //                         sap.m.MessageToast.show("Seat added successfully");
            //                         this._oDialogonAddSeats.close();
            //                         if (oContext)
            //                             oContext.getSource().getParent().getParent().getController().getView().getBindingContext().refresh();
            //                     }
            //                     else {
            //                         sap.m.MessageToast.show(`Seat already added for team -${seatAlreadyAdded.teamID}`);
            //                     }
            //                 } else {
            //                     sap.m.MessageToast.show("Please provide the correct seat no.!");
            //                 }
            //                 break;

            //             default:
            //         }
            //     } else {
            //         sap.m.MessageToast.show("Please write seat no. in required format!");
            //     }

            // }
        };
    }
);