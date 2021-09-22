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

        function _refreshExistingModel(reference) {
            var currrentData = reference._controller.getView().getModel("modelData").getData();
            reference._controller.getView().getModel("ExistingData").setData(JSON.parse(JSON.stringify(currrentData)));
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

        function fetchSeatData(oContext, reference)
        {
             var Currentdata;
          var oModelref = reference._controller.getView().getModel("modelData");
          var oModelrefExistingData = reference._controller.getView().getModel("ExistingData");
          var modelData = oModelref.getData();

          if (modelData.Seats.length === 0){

           var sFilterQuery = `teamID eq '${modelData.Property.teamID}'`;
            $.get({
                url: "/seat-booking/TeamSeatMapping",
                data: {
                    $filter: sFilterQuery
                },
                success: function (data) {
                    // csrfToken = xhr.getResponseHeader("x-csrf-token");
                    Currentdata = data;
                }, async: false
            });
            if (Currentdata.value){
              //  return Currentdata.value[0];
            oModelref.setProperty("/Seats", Currentdata.value);
            oModelrefExistingData.setProperty("/Seats", JSON.parse(JSON.stringify(Currentdata.value)));
            }
        }
    }



        return {
            ManagerBtnHandling: function (oContext) {
                var role_roleCode = _getUserDetails().role_roleCode;
                if ( role_roleCode === '01' || role_roleCode === '03') {
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
                                "Sync": true,
                                "teamID": userData.teamID,
                            },
                            "empList": [],
                            "Seats": []
                        };

                        var Currentdata = [];
                        var employee = {};
                        var sFilterQuery = `teamID eq '${userData.teamID}'`;
                        // Get existing employee for this team. 
                        $.get({
                            url: "/seat-booking/TeamEmployeeMasterWithName",
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
                           // var empName = _getEmployeeName();
                            Currentdata.value.forEach(element => {
                                employee.employeeID_ID = element.employeeID;
                                employee.role_roleCode = element.role_roleCode;
                                employee.empIDEdit = false;
                                employee.name = element.employeeName;
                                if (employee.role_roleCode === '01') {
                                    employee.roleOptionEdit = false;
                                }
                                else {
                                    employee.roleOptionEdit = true;
                                }
                                // var EmpName = empName.find(function (item) {
                                //     return item.ID === element.employeeID_ID;
                                // });
                                
                                //if (EmpName) { employee.name = EmpName.name; } else { employee.name = '' }
                                Newdata.empList.push(employee);
                                employee = {};
                            });
                            // We need name here of employee in better way.. 
                        }

                        var oView = this._controller.getView();
                        var oEmpModel = new sap.ui.model.json.JSONModel(Newdata);
                        oView.setModel(oEmpModel, "modelData");

                        var oExistingModel = new sap.ui.model.json.JSONModel(JSON.parse(JSON.stringify(Newdata)));
                        oView.setModel(oExistingModel, "ExistingData");

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
                if (selectedData.role_roleCode === '01' && selectedData.empIDEdit === false) {
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
                var that = this;
                var succssFlag;
                if (oContext.getSource().getParent().getParent().getSelectedContextPaths()) {
                    var paths = oContext.getSource().getParent().getParent().getSelectedContextPaths();
                    if (paths[0]) {
                        var oModelref = oContext.getSource().getModel("modelData");
                        var DeleteIndex = paths[0].split("/").pop();
                        var deleteData = oModelref.getData().empList[DeleteIndex];

                        var existingEmpData = this._controller.getView().getModel('ExistingData').getData().empList;

                        var EmpExist = existingEmpData.find(function (emp) {
                            return (emp.employeeID_ID === deleteData.employeeID_ID);
                        });

                        if (EmpExist) {

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
                                    _refreshExistingModel(that);
                                },
                                error: function (data) {
                                    succssFlag = false;
                                }, async: false
                            });
                        }

                        oModelref.getData().empList.splice(DeleteIndex, 1);
                        oContext.getSource().getParent().getParent().removeSelections();
                        oModelref.setProperty("/Property/DeleteEmpBtn", false);
                        this._controller.getView().getModel("modelData").refresh();
                        sap.m.MessageToast.show("Employee removed!");

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
                 var successFlag, EmpExist, that = this;

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
                var existingModelRef = this._controller.getView().getModel('ExistingData');
                var existingEmpData = existingModelRef.getData().empList;
               

                modelRef.getData().empList.forEach(element => {
                    empData.employeeID_ID = element.employeeID_ID.toUpperCase();
                    empData.role_roleCode = element.role_roleCode;
                    empData.teamID = teamID;

                    // empList.push(JSON.parse(JSON.stringify(empData)));

                    var EmpExist = existingEmpData.find(function (emp) {
                        return (emp.employeeID_ID === empData.employeeID_ID);
                    });

                    if (EmpExist) {
                        if (EmpExist.role_roleCode === empData.role_roleCode) {
                            EmpExist = undefined;
                            return;
                        }
                    }
                    else {

                        if (_getEmployeeNameByID(empData.employeeID_ID)) {

                            sFilterQuery = `employeeID_ID eq '${empData.employeeID_ID}'`;
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
                                if (Currentdata.value[0]) {
                                    if (Currentdata.value[0].teamID !== empData.teamID) {
                                        successFlag = "Fail";
                                        sap.m.MessageToast.show(`Employee '${empData.employeeID_ID}' already added for team '${Currentdata.value[0].teamID}'`);
                                        return;
                                       
                                    }
                                }
                            }
                        }
                        else {
                             sap.m.MessageToast.show(` '${empData.employeeID_ID}'ID is not correct & will not be saved`);
                          successFlag = "Fail";
                             return;
                        }
                    }

                    $.ajax({
                        url: "/seat-booking/TeamEmployeeMaster/" + empData.employeeID_ID,
                        type: 'PUT',
                        headers: {
                            "x-csrf-token": csrfToken,
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(JSON.parse(JSON.stringify(empData))),
                        success: function (data) {
                            _refreshExistingModel(that);
                        }, error: function (data, status) {
                            const newLocal = 'fail';
                            successFlag = newLocal;
                        }, async: false
                    });
                });
                if ( successFlag === "Fail") {
                //    sap.m.MessageToast.show("One of more data is not saved successfully");
                }
                else {
                    sap.m.MessageToast.show("Data saved successfully");
                }

            },

            CancelManagerBooking: function () {
                this._oDialogonManagerZone.close();
            },

            SaveSeat : function (oContext) {
              var  successFlag, that = this;
              var modelRef = this._controller.getView().getModel('modelData');
              var existingModelRef = this._controller.getView().getModel('ExistingData');
              var existingSeatData = existingModelRef.getData().Seats;       


                modelRef.getData().Seats.forEach(element => {

                    var seatExist = existingSeatData.find(function (seat) {
                        return (seat.seatID === element.seatID
                                && seat.monitorCount === element.monitorCount
                               && seat.facility1 === element.facility1
                               && seat.facility2 === element.facility2 );
                    });

                    if (seatExist) 
                        return;
                    else {
                        element.facility1 = parseInt(element.facility1);
                        element.facility2 = parseInt(element.facility2);
                        element.monitorCount = parseInt(element.monitorCount);
                           $.ajax({
                        url: "/seat-booking/TeamSeatMapping/" + element.seatID,
                        type: 'PUT',
                        headers: {
                         //   "x-csrf-token": csrfToken,
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(JSON.parse(JSON.stringify(element))),
                        success: function (data) {
                            _refreshExistingModel(that);
                            successFlag = 'success'
                        }, error: function (data, status) {
                            const newLocal = 'fail';
                            successFlag = newLocal;
                        }, async: false
                    });
                    }
                })
                if ( successFlag === "fail") {
                //    sap.m.MessageToast.show("One of more data is not saved successfully");
                }
                else {
                    sap.m.MessageToast.show("Data saved successfully");
                }


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
                    fetchSeatData(oContext, this);
                } else if (index === 2) {
                    modelRef.setProperty("/Property/EmployeeList", false);
                    modelRef.setProperty("/Property/SeatDetails", false);
                    modelRef.setProperty("/Property/usageAnalytics", true);
                }
            }
        };
    }
);
