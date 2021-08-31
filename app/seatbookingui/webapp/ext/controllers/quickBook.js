sap.ui.define(
    ["sap/ui/model/odata/v4/ODataModel",
        "sap/m/Token",
        "sap/ui/model/json/JSONModel"
        
    ],
    function (ODataModel, Token, JSONModel) {
        "use strict";
        return {

            quickBooking: function (oContext) {
                alert("QB called");
            }
          };
    }
);