//@ui5-bundle seatbookingui/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"seatbookingui/Component.js":function(){sap.ui.define(["sap/fe/core/AppComponent"],function(e){"use strict";return e.extend("seatbookingui.Component",{metadata:{manifest:"json"}})});
},
	"seatbookingui/ext/controllers/ShowAvailability.js":function(){sap.ui.define(["sap/ui/model/odata/v4/ODataModel","sap/m/Token","sap/ui/model/json/JSONModel"],function(e,a,t){"use strict";return{ImageCancelPress:function(e){this._oDialogonImage.close()},OpenAvailabilityDialog:function(e){var a=this._controller.getView();if(!this._oDialogonImage){this._oDialogonImage=sap.ui.xmlfragment(a.getId(),"seatbookingui.ext.fragments.openImage",this);a.addDependent(this._oDialogonImage)}this._oDialogonImage.open()},quickBooking:function(e){var a;var t=new Date;var o;var s=t.getHours();var i;if(s>13){t.setDate(t.getDate()+1)}else{}o=t.getFullYear()+"-"+("0"+(t.getMonth()+1)).slice(-2)+"-"+("0"+t.getDate()).slice(-2);var n=`employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}' and bookingDate eq ${o}`;$.get({url:"/seat-booking/Booking",headers:{"x-csrf-token":"fetch"},data:{$filter:n},success:function(e,t,o){a=e},async:false});if(a.value){if(a.value.length>0){sap.m.MessageToast.show(`You already have a booking for '${o}'`)}else{var n=`employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}'`;$.get({url:"/seat-booking/TeamEmployeeMaster",data:{$filter:n},success:function(e,t,o){a=e},async:false});if(a.value){if(a.value.length>0){i=a.value.teamID;var n=`teamID eq '${i}'`;$.get({url:"/seat-booking/TeamSeatMapping",data:{$filter:n},success:function(e){a=e},async:false});if(a.value){if(a.value.length>0){}}}}else{sap.m.MessageToast.show(`You`)}}}}}});
},
	"seatbookingui/ext/controllers/UpdateBooking.js":function(){sap.ui.define(["sap/ui/model/odata/v4/ODataModel","sap/m/Token","sap/ui/model/json/JSONModel"],function(e,a,o){"use strict";return{ImageCancelPress:function(e){this._oDialogonImage.close()},OpenUpdateBookingDialog:function(e){var a=this._controller.getView();if(!this._oDialogonImage){this._oDialogonImage=sap.ui.xmlfragment(a.getId(),"seatbookingui.ext.fragments.openImage",this);a.addDependent(this._oDialogonImage)}this._oDialogonImage.open()},quickBooking:function(e){var a;var o=new Date;var t;var s=o.getHours();var n;if(s>13){o.setDate(o.getDate()+1)}else{}t=o.getFullYear()+"-"+("0"+(o.getMonth()+1)).slice(-2)+"-"+("0"+o.getDate()).slice(-2);var i=`employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}' and bookingDate eq ${t}`;$.get({url:"/seat-booking/Booking",headers:{"x-csrf-token":"fetch"},data:{$filter:i},success:function(e,o,t){a=e},async:false});if(a.value){if(a.value.length>0){sap.m.MessageToast.show(`You already have a booking for '${t}'`)}else{var i=`employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}'`;$.get({url:"/seat-booking/TeamEmployeeMaster",data:{$filter:i},success:function(e,o,t){a=e},async:false});if(a.value){if(a.value.length>0){n=a.value.teamID;var i=`teamID eq '${n}'`;$.get({url:"/seat-booking/TeamSeatMapping",data:{$filter:i},success:function(e){a=e},async:false});if(a.value){if(a.value.length>0){}}}}else{sap.m.MessageToast.show(`You`)}}}}}});
},
	"seatbookingui/ext/controllers/managerZone.js":function(){sap.ui.define(["sap/ui/model/odata/v4/ODataModel","sap/m/Token","sap/ui/model/json/JSONModel"],function(e,t,a){"use strict";function o(){var e=[];var t=`employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}'`;$.get({url:"/seat-booking/TeamEmployeeMaster",headers:{"x-csrf-token":"fetch"},data:{$filter:t},success:function(t,a,o){e=t},async:false});if(e.value){if(e.value[0]){return e.value[0]}}}function r(){var e=[];$.get({url:"/seat-booking/TeamMemberRole",success:function(t){e=t},async:false});if(e.value)return e.value}function s(e){var t=e._controller.getView().getModel("modelData").getData();e._controller.getView().getModel("ExistingData").setData(JSON.parse(JSON.stringify(t)))}function n(){var e=[];$.get({url:"/seat-booking/Users",success:function(t){e=t},async:false});if(e.value)return e.value}function l(e){var t;var a=`ID eq '${e}'`;$.get({url:"/seat-booking/Users",data:{$filter:a},success:function(e){t=e},async:false});if(t.value[0])return t.value[0]}function i(e,t){var a;var o=t._controller.getView().getModel("modelData");var r=t._controller.getView().getModel("ExistingData");var s=o.getData();if(s.Seats.length===0){var n=`teamID eq '${s.Property.teamID}'`;$.get({url:"/seat-booking/TeamSeatMapping",data:{$filter:n},success:function(e){a=e},async:false});if(a.value){o.setProperty("/Seats",a.value);r.setProperty("/Seats",JSON.parse(JSON.stringify(a.value)))}}}return{ManagerBtnHandling:function(e){var t=o().role_roleCode;if(t==="01"||t==="03"){return true}else{return false}},openManagerZoneDialog:function(e){var t=o();if(t){if(t.role_roleCode==="01"||o().role_roleCode==="03"){var a=r();var s={radiobutton:[{type:"Update Team Details & Roles"},{type:"Updates seat details"},{type:"Usage analytics"}],userRoleDetails:a,Property:{EmployeeList:true,SeatDetails:false,usageAnalytics:false,MainRadioBtnIndex:0,AddEmpBtn:true,DeleteEmpBtn:false,DeleteEmpBtnTT:"Remove Employee",Sync:true,teamID:t.teamID},empList:[],Seats:[]};var n=[];var l={};var i=`teamID eq '${t.teamID}'`;$.get({url:"/seat-booking/TeamEmployeeMasterWithName",headers:{"x-csrf-token":"fetch"},data:{$filter:i},success:function(e,t,a){n=e},async:false});if(n.value){n.value.forEach(e=>{l.employeeID_ID=e.employeeID_ID;l.role_roleCode=e.role_roleCode;l.empIDEdit=false;l.name=e.employeeName;if(l.role_roleCode==="01"){l.roleOptionEdit=false}else{l.roleOptionEdit=true}s.empList.push(l);l={}})}var p=this._controller.getView();var f=new sap.ui.model.json.JSONModel(s);p.setModel(f,"modelData");var c=new sap.ui.model.json.JSONModel(JSON.parse(JSON.stringify(s)));p.setModel(c,"ExistingData");if(!this._oDialogonManagerZone){this._oDialogonManagerZone=sap.ui.xmlfragment(p.getId(),"seatbookingui.ext.fragments.managerZone",this);p.addDependent(this._oDialogonManagerZone)}this._oDialogonManagerZone.open()}}},SaveManagerBooking:function(e){alert("save called")},AddEmployee:function(e){var t=e.getSource().getModel("modelData");var a={employeeID_ID:"",role_roleCode:"02",roleOptionEdit:true,name:"",empIDEdit:true};t.getData().empList.unshift(a);t.refresh()},onEmpListSelectionChange:function(e){var t=e.getSource().getModel("modelData");var a=t.getProperty(e.getSource().getSelectedContextPaths()[0]);if(a.role_roleCode==="01"&&a.empIDEdit===false){t.setProperty("/Property/DeleteEmpBtn",false);t.setProperty("/Property/DeleteEmpBtnTT","Manager cannot be removed from this screen")}else{t.setProperty("/Property/DeleteEmpBtn",true);t.setProperty("/Property/DeleteEmpBtnTT","Press to remove selected employee from your team")}},SyncData:function(e){sap.m.MessageToast.show("Action in process, It will fetch data from SAP Employee DB for the manager")},DeleteEmp:function(e){var t=this;var a;if(e.getSource().getParent().getParent().getSelectedContextPaths()){var o=e.getSource().getParent().getParent().getSelectedContextPaths();if(o[0]){var r=e.getSource().getModel("modelData");var n=o[0].split("/").pop();var l=r.getData().empList[n];var i=this._controller.getView().getModel("ExistingData").getData().empList;var p=i.find(function(e){return e.employeeID_ID===l.employeeID_ID});if(p){$.ajax({url:"/seat-booking/TeamEmployeeMaster/"+l.employeeID_ID,type:"DELETE",headers:{"Content-Type":"application/json"},success:function(e){a=true;s(t)},error:function(e){a=false},async:false})}r.getData().empList.splice(n,1);e.getSource().getParent().getParent().removeSelections();r.setProperty("/Property/DeleteEmpBtn",false);this._controller.getView().getModel("modelData").refresh();sap.m.MessageToast.show("Employee removed!")}}},ShowEmpName:function(e){var t=l(e.getParameter("value").toUpperCase());if(!t){name="unknownUser/WrongID"}else{name=t.name}e.getSource().getModel("modelData").setProperty(e.getSource().getBindingInfo("value").binding.getContext().getPath()+"/name",name)},SaveEmployee:function(){var e={},t,a=[];var o,r,n=this;var i=`employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}'`;var p,f=[];$.get({url:"/seat-booking/TeamEmployeeMaster",headers:{"x-csrf-token":"fetch"},data:{$filter:i},success:function(e,t,a){p=a.getResponseHeader("x-csrf-token");f=e},async:false});if(f.value){if(f.value[0]){t=f.value[0].teamID}}var c=this._controller.getView().getModel("modelData");var u=this._controller.getView().getModel("ExistingData");var g=u.getData().empList;c.getData().empList.forEach(a=>{e.employeeID_ID=a.employeeID_ID.toUpperCase();e.role_roleCode=a.role_roleCode;e.teamID=t;var r=g.find(function(t){return t.employeeID_ID===e.employeeID_ID});if(r){if(r.role_roleCode===e.role_roleCode){r=undefined;return}}else{if(l(e.employeeID_ID)){i=`employeeID_ID eq '${e.employeeID_ID}'`;$.get({url:"/seat-booking/TeamEmployeeMaster",data:{$filter:i},success:function(e,t,a){f=e},async:false});if(f.value){if(f.value[0]){if(f.value[0].teamID!==e.teamID){o="Fail";sap.m.MessageToast.show(`Employee '${e.employeeID_ID}' already added for team '${f.value[0].teamID}'`);return}}}}else{sap.m.MessageToast.show(` '${e.employeeID_ID}'ID is not correct & will not be saved`);o="Fail";return}}$.ajax({url:"/seat-booking/TeamEmployeeMaster/"+e.employeeID_ID,type:"PUT",headers:{"x-csrf-token":p,"Content-Type":"application/json"},data:JSON.stringify(JSON.parse(JSON.stringify(e))),success:function(e){s(n)},error:function(e,t){const a="fail";o=a},async:false})});if(o==="Fail"){}else{sap.m.MessageToast.show("Data saved successfully")}},CancelManagerBooking:function(){this._oDialogonManagerZone.close()},SaveSeat:function(e){var t,a=this;var o=this._controller.getView().getModel("modelData");var r=this._controller.getView().getModel("ExistingData");var n=r.getData().Seats;o.getData().Seats.forEach(e=>{var o=n.find(function(t){return t.seatID===e.seatID&&t.monitorCount===e.monitorCount&&t.facility1===e.facility1&&t.facility2===e.facility2});if(o)return;else{e.facility1=parseInt(e.facility1);e.facility2=parseInt(e.facility2);e.monitorCount=parseInt(e.monitorCount);$.ajax({url:"/seat-booking/TeamSeatMapping/"+e.seatID,type:"PUT",headers:{"Content-Type":"application/json"},data:JSON.stringify(JSON.parse(JSON.stringify(e))),success:function(e){s(a);t="success"},error:function(e,a){const o="fail";t=o},async:false})}});if(t==="fail"){}else{sap.m.MessageToast.show("Data saved successfully")}},ManagerTypeSelection:function(e){var t=this._controller.getView().getModel("modelData");var a=t.getProperty("/Property/MainRadioBtnIndex");if(a===0){t.setProperty("/Property/EmployeeList",true);t.setProperty("/Property/SeatDetails",false);t.setProperty("/Property/usageAnalytics",false)}else if(a===1){t.setProperty("/Property/EmployeeList",false);t.setProperty("/Property/SeatDetails",true);t.setProperty("/Property/usageAnalytics",false);i(e,this)}else if(a===2){t.setProperty("/Property/EmployeeList",false);t.setProperty("/Property/SeatDetails",false);t.setProperty("/Property/usageAnalytics",true)}}}});
},
	"seatbookingui/ext/controllers/planBooking.js":function(){sap.ui.define(["sap/ui/model/odata/v4/ODataModel","sap/m/Token","sap/ui/model/json/JSONModel"],function(e,o,t){"use strict";function a(){var e=[];var o=`employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}'`;$.get({url:"/seat-booking/TeamEmployeeMaster",headers:{"x-csrf-token":"fetch"},data:{$filter:o},success:function(o,t,a){e=o},async:false});if(e.value){if(e.value[0]){return e.value[0]}}}function r(e){var o;var t=`ID eq '${e}'`;$.get({url:"/seat-booking/Users",data:{$filter:t},success:function(e){o=e},async:false});if(o.value[0])return o.value[0]}function n(e,o){var t=[];var a=`teamID eq '${e}'`;var r=`/seat-booking/EmployeeBookingStatus(ip_teamID='${e}',ip_date=${o})/Set`;$.get({url:r,success:function(e,o,a){t=e},async:false});if(t.value){return t.value}}return{openPlanBookingDialog:function(e){sap.ui.core.BusyIndicator.show(0);var o=a();var t={radiobutton:[{type:"Individual Booking"},{type:"Group Booking(*visible to Manager/lead role)"}],Property:{index:0,MyBooking:true,OnBehalfBooking:false,GroupBooking:false,GroupBookingDate:""},userDetails:{employeeID_ID:o.employeeID_ID,role_roleCode:o.role_roleCode,teamID:o.teamID},Seats:[{Date:"12.06.2021",SeatNo:"BLR04-2F-001",monitors:"2",others:"power,ext",available:"Full Day",Seat:"11"},{Date:"12.06.2021",SeatNo:"BLR04-2F-004",monitors:"2",others:"power,ext",available:"1st Half Day",Seat:"11"},{Date:"12.06.2021",SeatNo:"BLR04-2F-008",monitors:"1",others:"power,ext",available:"1st Half Day",Seat:"11"},{Date:"12.06.2021",SeatNo:"BLR04-2F-001",monitors:"2",others:"power,ext",available:"Full Day",Seat:"9"},{Date:"13.06.2021",SeatNo:"BLR04-2F-001",monitors:"1",others:"power,ext",available:"Full Day",Seat:"9"}],empList:[]};var r=this._controller.getView();var n=new sap.ui.model.json.JSONModel(t);r.setModel(n,"modelData");if(!this._oDialogonPlanBooking){this._oDialogonPlanBooking=sap.ui.xmlfragment(r.getId(),"seatbookingui.ext.fragments.planBooking",this);r.addDependent(this._oDialogonPlanBooking)}this._oDialogonPlanBooking.open();sap.ui.core.BusyIndicator.hide()},onSelectChange:function(e){alert("search called")},PlanBookingCancelPress:function(){this._oDialogonPlanBooking.close()},BookingTypeSelection:function(e){var o=this._controller.getView().getModel("modelData");var t=o.getProperty("/Property/index");var a=o.getProperty("/userDetails");if(a.role_roleCode!=="03"){if(t===0){o.setProperty("/Property/MyBooking",true);o.setProperty("/Property/OnBehalfBooking",false);o.setProperty("/Property/GroupBooking",false)}else if(t===1){o.setProperty("/Property/MyBooking",false);o.setProperty("/Property/OnBehalfBooking",false);o.setProperty("/Property/GroupBooking",true);if(o.getProperty("/empList").length===0){var r=n(a.teamID,o.getProperty("/Property/GroupBookingDate"))}}}else{o.setProperty("/Property/MyBooking",true);o.setProperty("/Property/OnBehalfBooking",false);o.setProperty("/Property/GroupBooking",false);o.setProperty("/Property/index",0);sap.m.MessageToast.show("This feature is not available yet for members")}}}});
},
	"seatbookingui/ext/controllers/quickBook.js":function(){sap.ui.define(["sap/ui/model/odata/v4/ODataModel","sap/m/Token","sap/ui/model/json/JSONModel"],function(e,a,o){"use strict";return{ImageCancelPress:function(e){this._oDialogonImage.close()},OpenImageDialog:function(e){var a=this._controller.getView();if(!this._oDialogonImage){this._oDialogonImage=sap.ui.xmlfragment(a.getId(),"seatbookingui.ext.fragments.openImage",this);a.addDependent(this._oDialogonImage)}this._oDialogonImage.open()},quickBooking:function(e){var a;var o=new Date;var t;var s=o.getHours();var n;if(s>13){o.setDate(o.getDate()+1)}else{}t=o.getFullYear()+"-"+("0"+(o.getMonth()+1)).slice(-2)+"-"+("0"+o.getDate()).slice(-2);$.get({url:"/seat-booking/getFreeSeat(employeeID='I334183', bookingDate='2021-08-31')"});var i=`employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}' and bookingDate eq ${t}`;$.get({url:"/seat-booking/Booking",headers:{"x-csrf-token":"fetch"},data:{$filter:i},success:function(e,o,t){a=e},async:false});if(a.value){if(a.value.length>0){sap.m.MessageToast.show(`You already have a booking for '${t}'`)}else{var i=`employeeID_ID eq '${sap.ushell.Container.getService("UserInfo").getId()}'`;$.get({url:"/seat-booking/TeamEmployeeMaster",data:{$filter:i},success:function(e,o,t){a=e},async:false});if(a.value){if(a.value.length>0){n=a.value.teamID;var i=`teamID eq '${n}'`;$.get({url:"/seat-booking/TeamSeatMapping",data:{$filter:i},success:function(e){a=e},async:false});if(a.value){if(a.value.length>0){}}}}else{sap.m.MessageToast.show(`You`)}}}}}});
},
	"seatbookingui/ext/fragments/managerZone.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" xmlns:fb="sap.ui.comp.filterbar" core:require="{ext : \'seatbookingui/ext/controllers/managerZone\'}"><Dialog title=\'Plan a booking\'><content><VBox width="630px" height="480px"><HBox><RadioButtonGroup buttons="{modelData>/radiobutton}" columns="3" selectedIndex="{modelData>/Property/MainRadioBtnIndex}" select="ext.ManagerTypeSelection"><buttons><RadioButton text="{modelData>type}"/></buttons></RadioButtonGroup></HBox><VBox visible="{modelData>/Property/SeatDetails}"><HeaderContainer></HeaderContainer><HBox><Table width="auto" noDataText="No Data Found" showSeparators="All" growing="true" growingThreshold="200" growingScrollToLoad="true"\n\t\t\t\t\t\t\titems="{modelData>/Seats}" id="Manager1" sticky="HeaderToolbar" enableBusyIndicator="true"><headerToolbar><OverflowToolbar width="auto" height="auto" visible="true" enabled="true"><content><Title text="Seat List" titleStyle="Auto" width="auto" textAlign="Begin" visible="true"/><ToolbarSpacer width=""/></content></OverflowToolbar></headerToolbar><columns><Column width="30%" hAlign="Left" visible=\'true\' vAlign="Middle" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline"\n\t\t\t\t\t\t\t\t\tmergeDuplicates="false"><header><Text text="Seat No." width="auto" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header></Column><Column width="20%" hAlign="Left" visible=\'true\' vAlign="Middle" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline"\n\t\t\t\t\t\t\t\t\tmergeDuplicates="false"><header><Text text="Monitors" width="auto" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header></Column><Column width="25%" hAlign="Left" visible=\'true\' vAlign="Middle" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline"\n\t\t\t\t\t\t\t\t\tmergeDuplicates="false"><header><Text text="Other Facility1" width="auto" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header></Column><Column width="25%" hAlign="Left" visible=\'true\' vAlign="Middle" mergeDuplicates="false"><header><Text text="Other Facility2" width="auto" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header></Column></columns><items><ColumnListItem type="Active"><cells><Text  text="{modelData>seatID}"/><Select forceSelection="true"  selectedKey="{modelData>monitorCount}" ><items><core:Item key="0" text="0"/><core:Item key="1" text="1"/><core:Item key="2" text="2"/></items></Select><Select forceSelection="true"  selectedKey="{modelData>facility1}" ><items><core:Item key=\'0\' text="Nothing extra"/><core:Item key=\'1\' text="Power extension"/><core:Item key=\'2\' text="Extra space"/><core:Item key=\'3\' text="LAN Cable"/></items></Select><Select forceSelection="true"  selectedKey="{modelData>facility2}" ><items><core:Item key=\'0\' text="Nothing extra"/><core:Item key=\'1\' text="Power extension"/><core:Item key=\'2\' text="Extra space"/><core:Item key=\'3\' text="LAN Cable"/></items></Select></cells></ColumnListItem></items></Table></HBox></VBox><VBox visible="{modelData>/Property/EmployeeList}"><HeaderContainer><Text text=\'Update Details\' textAlign="Center" width="600px"/></HeaderContainer><HBox class="sapUiSmallMargin"><Table width="auto" noDataText="No Data Found" showSeparators="All" growing="true" growingThreshold="5" growingScrollToLoad="true"\n\t\t\t\t\t\t\titems="{modelData>/empList}" id="Managere1" sticky="HeaderToolbar" mode="SingleSelectLeft" selectionChange=\'ext.onEmpListSelectionChange\'\n\t\t\t\t\t\t\tenableBusyIndicator="true"><headerToolbar><OverflowToolbar width="auto" height="auto" visible="true" enabled="true"><content><Title text="Employee List" titleStyle="Auto" width="auto" textAlign="Begin" visible="true"/><ToolbarSpacer width=""/><Button icon=\'sap-icon://add-employee\' text="Add" press=\'ext.AddEmployee\' tooltip="Add new employee"/><Button icon=\'sap-icon://delete\' text="Delete"  enabled="{modelData>/Property/DeleteEmpBtn}" press="ext.DeleteEmp" tooltip="{modelData>/Property/DeleteEmpBtnTT}"/><Button icon=\'sap-icon://synchronize\' text="Sync Data" press=\'ext.SyncData\' tooltip="Sync data with SAP DB"/></content></OverflowToolbar></headerToolbar><columns><Column width="30%" hAlign="Left" visible=\'true\' minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline" mergeDuplicates="false"><header><Text text="Employee ID" width="auto" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header></Column><Column width="45%" hAlign="Left" visible=\'true\' minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline" mergeDuplicates="false"><header><Text text="Name" width="auto" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header></Column><Column width="25%" hAlign="Left" visible=\'true\' minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline" mergeDuplicates="false"><header><Text text="Role" width="auto" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header></Column></columns><items><ColumnListItem type="Active"><cells><Input value="{modelData>employeeID_ID}" editable="{modelData>empIDEdit}" submit="ext.ShowEmpName"/><Text text="{modelData>name}"/><Select selectedKey="{modelData>role_roleCode}" items="{ path: \'modelData>/userRoleDetails\' , templateShareable:false}"   enabled="{= ${modelData>role_roleCode} !== \'01\' }" ><items><core:Item key="{modelData>roleCode}" text="{modelData>description}"/></items></Select></cells></ColumnListItem></items></Table></HBox></VBox><VBox visible="{modelData>/Property/usageAnalytics}"><HeaderContainer><Text text=\'Table with usage analytics will be shown here, given day how many seats are booked.....\' textAlign="Center" width="600px"/></HeaderContainer><HBox></HBox></VBox></VBox></content><buttons><Button text="Save Employee"  type="Default" iconFirst="true" enabled="true"  visible="{modelData>/Property/EmployeeList}" iconDensityAware="false" press="ext.SaveEmployee"/><Button text="Save Seats" type="Default" iconFirst="true" enabled="true" visible="{modelData>/Property/SeatDetails}" iconDensityAware="false" press="ext.SaveSeat"/><Button text="Close" type="Default" iconFirst="true" enabled="true" visible="true" iconDensityAware="false" press="ext.CancelManagerBooking"/></buttons></Dialog></core:FragmentDefinition>',
	"seatbookingui/ext/fragments/openImage.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\n    xmlns:core="sap.ui.core" core:require="{ext : \'seatbookingui/ext/controllers/quickBook\'}"\n    \n    xmlns:fb="sap.ui.comp.filterbar"><Dialog title=\'\'><content><VBox width="630px"><HBox><Image src=\'./ext/image/image.jpg\' width="630px" height="630px" /></HBox></VBox></content><buttons><Button text="Close" type="Default" iconFirst="true" enabled="true" visible="true" iconDensityAware="false" press="ext.ImageCancelPress"/></buttons></Dialog></core:FragmentDefinition>',
	"seatbookingui/ext/fragments/planBooking.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core" core:require="{ext : \'seatbookingui/ext/controllers/planBooking\'}" xmlns:fb="sap.ui.comp.filterbar"><Dialog title=\'Plan a booking\'><content><VBox width="630px" height="630px"><HBox><RadioButtonGroup buttons="{modelData>/radiobutton}" columns="3" selectedIndex="{modelData>/Property/index}" select="ext.BookingTypeSelection"><buttons><RadioButton text="{modelData>type}"/></buttons></RadioButtonGroup></HBox><VBox visible="{modelData>/Property/MyBooking}"><HeaderContainer><Text text=\'Booking for self\' textAlign="Center" width="600px"/></HeaderContainer><HBox width="600px"><fb:FilterBar reset="onReset" search="ext.onSelectChange" useToolbar="false" showGoOnFB="true"><fb:filterItems><fb:FilterItem name="D" label="Date" visibleInFilterBar=\'true\'><fb:control><DatePicker required="true" value="{modelData>/Property>GroupBookingDate}" width="180px"/></fb:control></fb:FilterItem><fb:FilterItem name="C" label="Monitors"><fb:control><Select id="slTewed2ype" forceSelection="true" width="30px"><items><core:Item key="2" text="2"/><core:Item key="1" text="1"/><core:Item key="0" text="0"/></items></Select></fb:control></fb:FilterItem></fb:filterItems></fb:FilterBar></HBox><HBox><Table width="auto" noDataText="No Data Found" showSeparators="All" growing="true" growingThreshold="4" growingScrollToLoad="true"\n\t\t\t\t\t\t\titems="{modelData>/Seats}" id="tabele1" sticky="HeaderToolbar" mode="MultiSelect" selectionChange=\'onTableSelectionChange\'\n\t\t\t\t\t\t\tenableBusyIndicator="true"><headerToolbar><OverflowToolbar width="auto" height="auto" visible="true" enabled="true"><content><Title text="Available Seat List" titleStyle="Auto" width="auto" textAlign="Begin" visible="true"/><ToolbarSpacer width=""/></content></OverflowToolbar></headerToolbar><columns><Column width="20%" hAlign="Left" visible=\'true\' vAlign="Middle" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline"\n\t\t\t\t\t\t\t\t\tmergeDuplicates="false"><header><Text text="Date" width="auto" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header></Column><Column width="20%" hAlign="Left" visible=\'true\' vAlign="Middle" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline"\n\t\t\t\t\t\t\t\t\tmergeDuplicates="false"><header><Text text="Seat No" width="auto" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header></Column><Column width="20%" hAlign="Left" visible=\'true\' vAlign="Middle" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline"\n\t\t\t\t\t\t\t\t\tmergeDuplicates="false"><header><Text text="Availability" tooltip="1st half(before lunch)" width="auto" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header></Column><Column width="20%" hAlign="Left" visible=\'true\' vAlign="Middle" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline"\n\t\t\t\t\t\t\t\t\tmergeDuplicates="false"><header><Text text="Monitors" width="auto" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header></Column><Column width="20%" hAlign="Left" visible=\'true\' vAlign="Middle" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline"\n\t\t\t\t\t\t\t\t\tmergeDuplicates="false"><header><Text text="Other facility" width="auto" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header></Column></columns><items><ColumnListItem type="Active"><cells><Text text="{modelData>Date}"/><Text text="{modelData>SeatNo}"/><Text text="{modelData>available}"/><Text text="{modelData>monitors}"/><Text text="{modelData>others}"/></cells></ColumnListItem></items></Table></HBox></VBox><VBox visible="{modelData>/Property/GroupBooking}"><HeaderContainer><Text text=\'Group Booking\' textAlign="Center" width="600px"/></HeaderContainer><HBox width="auto" class="sapUiSmallMargin"><fb:FilterBar reset="onReset" search="onSelectChange" useToolbar="false" showGoOnFB="true"><fb:filterItems><fb:FilterItem name="D" label="Date" visibleInFilterBar=\'true\'><fb:control><DatePicker required="true" value="{modelData>/Property>GroupBookingDate}" width="180px"/></fb:control></fb:FilterItem></fb:filterItems></fb:FilterBar></HBox><HBox class="sapUiSmallMargin"><Table width="auto" noDataText="No Data Found" showSeparators="All" growing="true" growingThreshold="4" growingScrollToLoad="true"\n\t\t\t\t\t\t\titems="{modelData>/empList}" id="tawebe3le1" sticky="HeaderToolbar" mode="MultiSelect" selectionChange=\'onTableSelectionChange\'\n\t\t\t\t\t\t\tenableBusyIndicator="true"><headerToolbar><OverflowToolbar width="auto" height="auto" visible="true" enabled="true"><content><Title text="Colleague List" titleStyle="Auto" width="auto" textAlign="Begin" visible="true"/><ToolbarSpacer width=""/></content></OverflowToolbar></headerToolbar><columns><Column width="50%" hAlign="Left" visible=\'true\' vAlign="Middle" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline"\n\t\t\t\t\t\t\t\t\tmergeDuplicates="false"><header><Text text="Employee Name" width="auto" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header></Column><Column width="50%" hAlign="Left" visible=\'true\' vAlign="Middle" minScreenWidth="Tablet" demandPopin="true" popinDisplay="Inline"\n\t\t\t\t\t\t\t\t\tmergeDuplicates="false"><header><Text text="Status for selected date" width="auto" wrapping="true" textAlign="Begin" textDirection="Inherit"/></header></Column></columns><items><ColumnListItem type="Active"><cells><Text text="{modelData>EmpName}"/><Text text="{modelData>BookingStatus}"/></cells></ColumnListItem></items></Table></HBox></VBox></VBox></content><buttons><Button text="Book for self" type="Default" iconFirst="true" enabled="true" visible="{modelData>/Property/MyBooking}"\n\t\t\t\ticonDensityAware="false" press="ext.DialogBookPress"/><Button text="Book on behalf" type="Default" iconFirst="true" enabled="true" visible="{modelData>/Property/MyBooking}"\n\t\t\t\ticonDensityAware="false" press="ext.DialogBookOtherPress"/><Button text="Book for selection" type="Default" iconFirst="true" enabled="true" visible="{modelData>/Property/GroupBooking}"\n\t\t\t\ticonDensityAware="false" press="ext.GroupBooking"/><Button text="Cancel" type="Default" iconFirst="true" enabled="true" visible="true" iconDensityAware="false" press="ext.PlanBookingCancelPress"/></buttons></Dialog></core:FragmentDefinition>',
	"seatbookingui/i18n/i18n.properties":'# This is the resource bundle for seatbookingui\n\n#Texts for manifest.json\n\n#XTIT: Application name\nappTitle=Book Seat\n\n#YDES: Application description\nappDescription=A Fiori application.\n\n\nquickBook=Quick Book\nPlanABooking=Plan a Booking\nShowAvailability=Show Availability\nUpdateBooking=Update Booking\nShowImage=Show seat map\nManagerZone= Manager\'s Zone',
	"seatbookingui/manifest.json":'{"_version":"1.32.0","sap.app":{"id":"seatbookingui","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","dataSources":{"mainService":{"uri":"seat-booking/","type":"OData","settings":{"odataVersion":"4.0"}}},"offline":false,"resources":"resources.json","sourceTemplate":{"id":"ui5template.fiorielements.v4.lrop","version":"1.0.0"},"crossNavigation":{"inbounds":{"seatbookingui-inbound":{"signature":{"parameters":{},"additionalParameters":"allowed"},"semanticObject":"seatbooking","action":"display","title":"Book Seat","subTitle":"Book your seat in the office","icon":""}}}},"sap.ui":{"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"resources":{"js":[],"css":[]},"dependencies":{"minUI5Version":"1.76.0","libs":{"sap.ui.core":{},"sap.fe.templates":{}}},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","uri":"i18n/i18n.properties"},"":{"dataSource":"mainService","preload":true,"settings":{"synchronizationMode":"None","operationMode":"Server","autoExpandSelect":true,"earlyRequests":true}}},"routing":{"routes":[{"pattern":":?query:","name":"BookingList","target":"BookingList"}],"targets":{"BookingList":{"type":"Component","id":"BookingList","name":"sap.fe.templates.ListReport","options":{"settings":{"entitySet":"Booking","variantManagement":"Page","controlConfiguration":{"@com.sap.vocabularies.UI.v1.LineItem":{"tableSettings":{"selectionMode":"Single"},"actions":{"QuickBook":{"press":"seatbookingui.ext.controllers.quickBook.quickBooking","text":"{i18n>quickBook}","enabled":true,"visible":true},"PlanBooking":{"press":"seatbookingui.ext.controllers.planBooking.openPlanBookingDialog","text":"{i18n>PlanABooking}","enabled":true,"visible":true},"ShowAvailability":{"press":"seatbookingui.ext.controllers.ShowAvailability.OpenAvailabilityDialog","text":"{i18n>ShowAvailability}","enabled":true,"visible":true},"UpdateBooking":{"press":"seatbookingui.ext.controllers.UpdateBooking.OpenUpdateBookingDialog","text":"{i18n>UpdateBooking}","enabled":true,"visible":true},"ShowImage":{"press":"seatbookingui.ext.controllers.quickBook.OpenImageDialog","text":"{i18n>ShowImage}","enabled":true,"visible":true},"ManagerZone":{"press":"seatbookingui.ext.controllers.managerZone.openManagerZoneDialog","text":"{i18n>ManagerZone}","enabled":"seatbookingui.ext.controllers.managerZone.ManagerBtnHandling","visible":true}}}}}}}}},"contentDensities":{"compact":true,"cozy":true}},"sap.platform.abap":{"_version":"1.1.0","uri":""},"sap.platform.hcp":{"_version":"1.1.0","uri":""},"sap.fiori":{"_version":"1.1.0","registrationIds":[],"archeType":"transactional"},"sap.cloud":{"public":true,"service":"FlexWork"}}',
	"seatbookingui/utils/locate-reuse-libs.js":'(function(e){fioriToolsGetManifestLibs=function(e){var t=e;var n="";var a=["sap.apf","sap.base","sap.chart","sap.collaboration","sap.f","sap.fe","sap.fileviewer","sap.gantt","sap.landvisz","sap.m","sap.ndc","sap.ovp","sap.rules","sap.suite","sap.tnt","sap.ui","sap.uiext","sap.ushell","sap.uxap","sap.viz","sap.webanalytics","sap.zen"];return new Promise(function(i,r){$.ajax(t).done(function(e){if(e){if(e["sap.ui5"]&&e["sap.ui5"].dependencies&&e["sap.ui5"].dependencies.libs){Object.keys(e["sap.ui5"].dependencies.libs).forEach(function(e){if(!a.some(function(t){return e===t||e.startsWith(t+".")})){if(n.length>0){n=n+","+e}else{n=e}}})}}i(n)}).fail(function(t){r(new Error("Could not fetch manifest at \'"+e))})})};e.registerComponentDependencyPaths=function(e){return fioriToolsGetManifestLibs(e).then(function(e){if(e&&e.length>0){var t="/sap/bc/ui2/app_index/ui5_app_info?id="+e;var n=jQuery.sap.getUriParameters().get("sap-client");if(n&&n.length===3){t=t+"&sap-client="+n}return $.ajax(t).done(function(e){if(e){Object.keys(e).forEach(function(t){var n=e[t];if(n&&n.dependencies){n.dependencies.forEach(function(e){if(e.url&&e.url.length>0&&e.type==="UI5LIB"){jQuery.sap.log.info("Registering Library "+e.componentId+" from server "+e.url);jQuery.sap.registerModulePath(e.componentId,e.url)}})}})}})}})}})(sap);var scripts=document.getElementsByTagName("script");var currentScript=scripts[scripts.length-1];var manifestUri=currentScript.getAttribute("data-sap-ui-manifest-uri");var componentName=currentScript.getAttribute("data-sap-ui-componentName");var useMockserver=currentScript.getAttribute("data-sap-ui-use-mockserver");sap.registerComponentDependencyPaths(manifestUri).catch(function(e){jQuery.sap.log.error(e)}).finally(function(){if(componentName&&componentName.length>0){if(useMockserver&&useMockserver==="true"){sap.ui.getCore().attachInit(function(){sap.ui.require([componentName.replace(/\\./g,"/")+"/localService/mockserver"],function(e){e.init();sap.ushell.Container.createRenderer().placeAt("content")})})}else{sap.ui.require(["sap/ui/core/ComponentSupport"])}}else{sap.ui.getCore().attachInit(function(){sap.ushell.Container.createRenderer().placeAt("content")})}});sap.registerComponentDependencyPaths(manifestUri);'
}});
