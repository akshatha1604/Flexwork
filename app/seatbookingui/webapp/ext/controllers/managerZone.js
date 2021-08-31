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

        function _getRoleDetails() {
            var Currentdata = [];
            $.get({
                url: "/seat-booking/TeamMemberRole",
                success: function (data) {
                    // csrfToken = xhr.getResponseHeader("x-csrf-token");
                    Currentdata = data;
                }, async: false
            });
            if (Currentdata.value)
                return Currentdata.value;
        }

        function _getEmployeeName() {
            var Currentdata = [];
            $.get({
                url: "/seat-booking/Users",
                success: function (data) {
                    // csrfToken = xhr.getResponseHeader("x-csrf-token");
                    Currentdata = data;
                }, async: false
            });
            if (Currentdata.value)
                return Currentdata.value;
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

        return {
            ManagerBtnHandling: function (oContext) {
                if (_getUserDetails().role_roleCode === '01' || _getUserDetails().role_roleCode === '03') {
                    return true;
                }
                else {
                    return false;
                }
            },

            openManagerZoneDialog: function (oContext) {
                var userData = _getUserDetails();

                if (userData) {
                    if (userData.role_roleCode === '01' || _getUserDetails().role_roleCode === '03') {

                        var userRoleDetails = _getRoleDetails();

                        var Newdata = {
                            "radiobutton": [{
                                "type": "Update Team Details & Roles"
                            }, {
                                "type": "Updates seat details"
                            }, {
                                "type": "Usage analytics"
                            }],
                            "userRoleDetails": userRoleDetails,
                            "Property": {
                                "EmployeeList": true,
                                "SeatDetails": false,
                                "usageAnalytics": false,
                                "MainRadioBtnIndex": 0,
                                "AddEmpBtn": true,
                                "DeleteEmpBtn": false,
                                "DeleteEmpBtnTT": "Remove Employee",
                                "Sync": true
                            },
                            "empList": [],
                            "Seats": [{
                                "SeatNo": "BLR04-2F-001",
                                "Monitors": "2",
                                "others": "Extension"
                            }, {
                                "SeatNo": "BLR04-2F-002",
                                "Monitors": "1",
                                "others": "Extension"
                            }, {
                                "SeatNo": "BLR04-2F-003",
                                "Monitors": "2",
                                "others": "Extension"
                            }]
                        };

                        var Currentdata = [];
                        var employee = {};
                        var sFilterQuery = `teamID eq '${userData.teamID}'`;
                        // Get existing employee for this team. 
                        $.get({
                            url: "/seat-booking/TeamEmployeeMaster",
                            headers: {
                                "x-csrf-token": "fetch"
                            }, data: {
                                $filter: sFilterQuery
                            },
                            success: function (data, status, xhr) {
                                // csrfToken = xhr.getResponseHeader("x-csrf-token");
                                Currentdata = data;
                            }, async: false
                        });
                        if (Currentdata.value) {
                            //  Newdata.empList = Currentdata.value ;
                            var empName = _getEmployeeName();
                            Currentdata.value.forEach(element => {
                                employee.employeeID_ID = element.employeeID_ID;
                                employee.role_roleCode = element.role_roleCode;
                                employee.empIDEdit = false;
                                if (employee.role_roleCode === '01') {
                                    employee.roleOptionEdit = false;
                                }
                                else {
                                    employee.roleOptionEdit = true;
                                }
                                var EmpName = empName.find(function (item) {
                                    return item.ID === element.employeeID_ID;
                                });
                                if (EmpName.name) { employee.name = EmpName.name; } else { employee.name = '' }
                                Newdata.empList.push(employee);
                                employee = {};
                            });
                            // We need name here of employee in better way.. 
                        }

                        var oView = this._controller.getView();
                        var oEmpModel = new sap.ui.model.json.JSONModel(Newdata);
                        oView.setModel(oEmpModel, "modelData");

                        //	sap.m.MessageToast.show("Popup to add/update team member, Update equipment on seats, assign different roles to user");

                        if (!this._oDialogonManagerZone) {
                            this._oDialogonManagerZone = sap.ui.xmlfragment(oView.getId(), "seatbookingui.ext.fragments.managerZone",
                                this);
                            oView.addDependent(this._oDialogonManagerZone);
                        }

                        // var oModel = new ODataModel({
                        //     serviceUrl: "/seat-booking/",
                        //     synchronizationMode: "None"
                        // });

                        // var oList = oModel.bindList("/TeamEmployeeMaster");

                        this._oDialogonManagerZone.open();
                    }
                }
            },
            SaveManagerBooking: function (oContext) {
                alert("save called");
            },

            AddEmployee: function (oContext) {
                var oModelref = oContext.getSource().getModel("modelData");
                var emptyData = {
                    "employeeID_ID": "",
                    "role_roleCode": "02",
                    "roleOptionEdit": true,
                    "name": "",
                    "empIDEdit": true

                };
                oModelref.getData().empList.unshift(emptyData);
                oModelref.refresh();
            },

            onEmpListSelectionChange: function (oContext) {
                var oModelref = oContext.getSource().getModel("modelData");
                var selectedData = oModelref.getProperty(oContext.getSource().getSelectedContextPaths()[0]);
                if (selectedData.role_roleCode === '01') {
                    oModelref.setProperty("/Property/DeleteEmpBtn", false);
                    oModelref.setProperty("/Property/DeleteEmpBtnTT", 'Manager cannot be removed from this screen');
                }
                else {
                    oModelref.setProperty("/Property/DeleteEmpBtn", true);
                    oModelref.setProperty("/Property/DeleteEmpBtnTT", 'Press to remove selected employee from your team');
                }
            },

            SyncData: function (oContext) {
                sap.m.MessageToast.show("Action in process, It will fetch data from SAP Employee DB for the manager");
            },

            DeleteEmp: function (oContext) {
                var succssFlag;
                if (oContext.getSource().getParent().getParent().getSelectedContextPaths()) {
                    var paths = oContext.getSource().getParent().getParent().getSelectedContextPaths();
                    if (paths[0]) {
                        var oModelref = oContext.getSource().getModel("modelData");
                        var DeleteIndex = paths[0].split("/").pop();

                        var deleteData = oModelref.getData().empList[DeleteIndex];

                        $.ajax({
                            url: "/seat-booking/TeamEmployeeMaster/" + deleteData.employeeID_ID,
                            type: 'DELETE',
                            headers: {
                                //   "x-csrf-token": csrfToken,
                                "Content-Type": "application/json"
                            },
                            //  data: JSON.stringify(JSON.parse(JSON.stringify(empData))),
                            success: function (data) {
                                succssFlag = true;
                            }, async: false
                        });
                     //   if (succssFlag) {
                            oModelref.getData().empList.splice(DeleteIndex, 1);
                            oContext.getSource().getParent().getParent().removeSelections();
                            oModelref.setProperty("/Property/DeleteEmpBtn", false);
                            this._controller.getView().getModel("modelData").refresh();
                            sap.m.MessageToast.show("Employee removed!");
                   //     }
                   //     else {
                        //    this._controller.getView().getModel("modelData").refresh();
                        //    sap.m.MessageToast.show("Please try again");
                     //   }

                    }
                }
            },

            ShowEmpName: function (oContext) {
                var userName = _getEmployeeNameByID(oContext.getParameter('value').toUpperCase());
                if (!userName) {
                    name = 'unknownUser/WrongID';
                }
                else {
                    name = userName.name;
                }
                oContext.getSource().getModel("modelData").setProperty(oContext.getSource().getBindingInfo('value').binding.getContext().getPath() + '/name', name);
            },

            SaveEmployee: function () {
                var empData = {}, teamID, empList = [];


                var sFilterQuery = `employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}'`;
                var csrfToken, Currentdata = [];
                $.get({
                    url: "/seat-booking/TeamEmployeeMaster",
                    headers: {
                        "x-csrf-token": "fetch"
                    },
                    data: {
                        $filter: sFilterQuery
                    },
                    success: function (data, status, xhr) {
                        csrfToken = xhr.getResponseHeader("x-csrf-token");
                        Currentdata = data;
                    }, async: false
                });

                if (Currentdata.value) {
                    if (Currentdata.value[0]) {
                        teamID = Currentdata.value[0].teamID;
                    }
                }
                var modelRef = this._controller.getView().getModel('modelData');

                modelRef.getData().empList.forEach(element => {
                    empData.employeeID_ID = element.employeeID_ID.toUpperCase();
                    empData.role_roleCode = element.role_roleCode;
                    empData.teamID = teamID;

                    // empList.push(JSON.parse(JSON.stringify(empData)));


                    $.ajax({
                        url: "/seat-booking/TeamEmployeeMaster/" + empData.employeeID_ID,
                        type: 'PUT',
                        headers: {
                            "x-csrf-token": csrfToken,
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(JSON.parse(JSON.stringify(empData))),
                        success: function (data) {
                        }, async: false
                    });
                });



            },

            CancelManagerBooking: function () {
                this._oDialogonManagerZone.close();
            },
            ManagerTypeSelection: function (oContext) {

                var modelRef = this._controller.getView().getModel('modelData');

                var index = modelRef.getProperty("/Property/MainRadioBtnIndex");

                if (index === 0) {
                    modelRef.setProperty("/Property/EmployeeList", true);
                    modelRef.setProperty("/Property/SeatDetails", false);
                    modelRef.setProperty("/Property/usageAnalytics", false);
                } else if (index === 1) {
                    modelRef.setProperty("/Property/EmployeeList", false);
                    modelRef.setProperty("/Property/SeatDetails", true);
                    modelRef.setProperty("/Property/usageAnalytics", false);
                } else if (index === 2) {
                    modelRef.setProperty("/Property/EmployeeList", false);
                    modelRef.setProperty("/Property/SeatDetails", false);
                    modelRef.setProperty("/Property/usageAnalytics", true);
                }
            }
        };
    }
);
