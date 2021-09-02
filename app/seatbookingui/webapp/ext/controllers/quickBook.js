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
                else {
                    // MyDateString = (MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-'
                    //     + ('0' + MyDate.getDate()).slice(-2));
                }
                MyDateString = (MyDate.getFullYear() + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '-'
                    + ('0' + MyDate.getDate()).slice(-2));

                //      $.get({
                //     url: "/seat-booking/getFreeSeat(EmployeeID='123')",
                    
                //     success: function (data){
                       
                //     }, async: false
                // });  

                var sFilterQuery = `employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}' and bookingDate eq ${MyDateString}`;
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
                                myTeamID = Currentdata.value.teamID;

                                // Get all seats for my team..         
                                var sFilterQuery = `teamID eq '${myTeamID}'`;
                                $.get({
                                    url: "/seat-booking/TeamSeatMapping",
                                    data: {
                                        $filter: sFilterQuery
                                    },
                                    success: function (data) {
                                        Currentdata = data;
                                    }, async: false
                                });
                                if (Currentdata.value) {
                                    if (Currentdata.value.length > 0) {

                                        // Get all booking for my team for that day.. 

                                    }
                                }
                            }
                        }
                        else {
                            sap.m.MessageToast.show(`You`);
                        }





                        // Get all booking for that day..

                        //Check if any seat is available.. 

                        //Create one entry here.. 
                    }
                }
            }
        };
    }
);