//const cds = require('@sap/cds')

sap.ui.define(
    ["sap/ui/model/odata/v4/ODataModel",
        "sap/m/Token",
        "sap/ui/model/json/JSONModel"
        // ,"adminui/ext/controller/ObjectPageExt"
    ],
    function (ODataModel, Token, JSONModel) {
        "use strict";
        return {
            buttonHandling: function (oContext) {
                return false;
            },

            openAddSeatDialog: function (oContext) {
                var contextData = oContext.getObject(oContext.sPath);

                var locationID = contextData.locationID;
                var teamID = contextData.teamID;

                //   var title = `Allocate new seats for location -${locationID} & Team -${teamID}`;

                var Newdata = {
                    "radiobutton": [{
                        "Seat": `Seat Range(0001-0005)`
                    }, {
                        "Seat": "Multiple seats, comma separated(0001,0002)"
                    }, {
                        "Seat": "Single Seat(0001)"
                    }],
                    "Property": {
                        "inputField": "",
                        "SelectedIndex": -1,
                        "locationID": locationID,
                        "teamID": teamID,
                        "title": `Allocate new seats for location- ${locationID} & Team- ${teamID}`,
                        "placeHolder": "Select desired format and provide data"
                    }
                };
                var oModel = new sap.ui.model.json.JSONModel(Newdata);
                this._controller.getView().setModel(oModel, "NewModel");

                var oView = this._controller.getView();

                if (!this._oDialogonAddSeats) {

                    this._oDialogonAddSeats = sap.ui.xmlfragment(oView.getId(), "adminui.ext.fragments.addSeats",
                        this);

                    oView.addDependent(this._oDialogonAddSeats);
                }
                this._oDialogonAddSeats.open();
            },

            AddSeatCancelPress: function () {
                this._oDialogonAddSeats.close();
            },
            onCustomValueSelected: function () {
                var oData = this._controller.getView().getModel("NewModel").getData();
                var placeHolder;
                switch (oData.Property.SelectedIndex) {
                    case -1:
                        sap.m.MessageToast.show("No option selected, kindly select an option above");
                        break;
                    case 0:
                        placeHolder = "Enter the only seat no. (Exp: 0001-9999) as the currently selected format.";
                        break;
                    case 1:
                        placeHolder = "Enter the only seat no. (Exp: 0001,0002,..) as the currently selected format."
                        break;
                    case 2:
                        placeHolder = "Enter the only seat no.(Exp: 0001) as the currently selected format.";
                        break;
                }
                this._controller.getView().getModel("NewModel").setProperty("/Property/placeHolder", placeHolder);
            },

            postDataToDB: function (modelData, seatNos) {

                var csrfToken, Currentdata = [], newData = {
                    "seatID": "",
                    "locationID": "",
                    "teamID": "",
                    "monitorCount": "",
                    "facility1": "",
                    "facility2": "",
                    "facility3": "",
                 //   "HasActiveEntity": false,
                   // "HasDraftEntity":false,
                    "IsActiveEntity": true,
                };
                $.get({
                    url: "/admin/TeamSeatMapping",
                    headers: {
                        "x-csrf-token": "fetch"
                    },
                    success: function (data, status, xhr) {
                        csrfToken = xhr.getResponseHeader("x-csrf-token");
                        Currentdata = data;
                        // if (status === that.Constants.STATUS.SUCCESS && data &&
                        // 	data.value && data.value.length !== 0) {
                        // 	resolve(data.value);
                        // } else {
                        // 	reject();
                        // }
                    }, async: false
                });
                if (Currentdata !== '') {
                    //Check given seat no. in current data
                    newData = Currentdata.value[0];
                    newData.seatID = seatNos[0];
                }

                $.post({
                    url: "/admin/TeamSeatMapping",
                    headers: {
                        "x-csrf-token": csrfToken,
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(newData),
                    success: function (data) {
                    }, async: false
                });
            },


            SaveSeatPress: function (oContext, aSelectedContexts) {
                var seatNo;
                var seatNos = [];
                var that = this;
                var newData = {
                    "seatID": "",
                    "locationID": "",
                    "teamID": "",
                    "monitorCount": 0,
                    "facility1": 0,
                    "facility2": 0,
                    "facility3": 0,
                  //  "HasActiveEntity": false,
                  //  "HasDraftEntity":false,
                    "IsActiveEntity": true
                };

                var oData = this._controller.getView().getModel("NewModel").getData();
                newData.locationID = oData.Property.locationID;
                newData.teamID = oData.Property.teamID;
                if (oData.Property.inputField !== "") {
                    switch (oData.Property.SelectedIndex) {
                        case -1:
                            sap.m.MessageToast.show("No option selected, kindly select and try again");
                            break;
                        case 0:
                            if (oData.Property.inputField.includes("-")) {
                                //add logic
                                sap.m.MessageToast.show("Development in-progress, Please use single seat option");
                             //   this._oDialogonAddSeats.close();
                            } else {
                                //add logic
                                sap.m.MessageToast.show("Selected format and input is not same, Please retry in correct format");
                            }
                            break;
                        case 1:
                            if (oData.Property.inputField.includes(",")) {
                                //add logic
                                 sap.m.MessageToast.show("Development in-progress, Please use single seat option");
                              //  this._oDialogonAddSeats.close();
                            } else {
                                //add logic
                                sap.m.MessageToast.show("Selected format and input is not same, Please retry in correct format!");
                            }
                            break;
                        case 2:
                            if (oData.Property.inputField.length === 4) {
                                seatNo = oData.Property.locationID + oData.Property.inputField;
                                seatNos.push(seatNo);

                                //   this.postDataToDB(oData, seatNos);

                                //Get a call to find if given seat is valid seat like below. 
                                var csrfToken, Currentdata = [], newData;
                                var sFilterQuery = `seatID eq '${seatNo}' and IsActiveEntity eq true`;
                                $.get({
                                    url: "/admin/TeamSeatMapping",
                                    headers: {
                                        "x-csrf-token": "fetch"
                                    }, data: {
                                        $filter: sFilterQuery
                                    },
                                    success: function (data, status, xhr) {
                                        csrfToken = xhr.getResponseHeader("x-csrf-token");
                                        Currentdata = data;

                                    }, async: false
                                });
                                if (Currentdata.value.length !== 0) {
                                    var seatAlreadyAdded = Currentdata.value.find(function (item) {
                                        return item.seatID === seatNo;
                                    });

                                }
                                if (!seatAlreadyAdded) {
                                    newData.seatID = seatNos[0];

                                    $.post({
                                        url: "/admin/TeamSeatMapping",
                                        headers: {
                                            "x-csrf-token": csrfToken,
                                            "Content-Type": "application/json"
                                        },
                                        data: JSON.stringify(newData),
                                        success: function (data) {
                                            //   csrfToken = xhr.getResponseHeader("x-csrf-token");
                                            //   Currentdata = data;
                                            // if (status === that.Constants.STATUS.SUCCESS && data &&
                                            // 	data.value && data.value.length !== 0) {
                                            // 	resolve(data.value);
                                            // } else {
                                            // 	reject();
                                            // }
                                            sap.m.MessageToast.show("Seat added successfully");
                                        }, async: false
                                    });


                                    sap.m.MessageToast.show("Seat added successfully");
                                    this._oDialogonAddSeats.close();
                                    if (oContext)
                                        oContext.getSource().getParent().getParent().getController().getView().getBindingContext().refresh();
                                }
                                else {
                                    sap.m.MessageToast.show(`Seat already added for team -${seatAlreadyAdded.teamID}`);
                                }
                            } else {
                                sap.m.MessageToast.show("Please provide the correct seat no.!");
                            }
                            break;

                        default:
                    }
                } else {
                    sap.m.MessageToast.show("Please write seat no. in required format!");
                }

            }
        };
    }
);