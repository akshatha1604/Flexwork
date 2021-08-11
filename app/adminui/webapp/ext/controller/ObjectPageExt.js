sap.ui.define(
    [],
    function () {
        "use strict";
        return {
            openAddSeatDialog: function (oContext, aSelectedContexts) {
                // oContext :  is the binding context of the current entity
                // aSelectedContexts : contains an array of binding contexts corresponding to
                //       selected items in case of table action (or)
                //
                //   alert("message new");
                var Newdata = {
                    "radiobutton": [{
                        "Seat": "Seat Range(A001-A005)"
                    }, {
                        "Seat": "Multiple seats, comma separated(A001,A002)"
                    }, {
                        "Seat": "Single Seat(A001)"
                    }],
                    "Property": {
                        "DeleteButtonIcon": "sap-icon://delete"
                    }
                };
                var oNewChatModel = new sap.ui.model.json.JSONModel(Newdata);
                this._controller.getView().setModel(oNewChatModel, "NewChatModel");

                var oView = this._controller.getView();

                if (!this._oDialogonAddSeats) {

                    this._oDialogonAddSeats = sap.ui.xmlfragment(oView.getId(), "adminui.ext.fragments.addSeats",
                        this);

                    oView.addDependent(this._oDialogonAddSeats);
                }
                this._oDialogonAddSeats.open();
            },

            AddSeatCancelPress: function (oContext, aSelectedContexts) {
              this._oDialogonAddSeats.close();
            }
        };
    }
);