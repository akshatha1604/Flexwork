const cds = require('@sap/cds')
/**
 * Implementation for add service defined here
 */
// module.exports = cds.service.impl(async function () {
//     this.after('READ', 'TeamSeatMapping', (each) => {
//         each.addSeat = enabled
//     })
// }
// )


// sap.ui.define([
// 	"sap/ui/core/mvc/Controller",
// 	"sap/ui/core/Core",
// 	"sap/ui/layout/HorizontalLayout",
// 	"sap/ui/layout/VerticalLayout",
// 	"sap/m/Dialog",
// 	"sap/m/DialogType",
// 	"sap/m/Button",
// 	"sap/m/ButtonType",
// 	"sap/m/Label",
// 	"sap/m/MessageToast",
// 	"sap/m/Text",
// 	"sap/m/TextArea"
// ], function (Controller, Core, HorizontalLayout, VerticalLayout, Dialog, DialogType, Button, ButtonType, Label, MessageToast, Text, TextArea) {
// 	"use strict";

// 	return Controller.extend("sap.m.sample.DialogConfirm.C", {

		
// 		addSeat: function () {
// 			if (!this.oSubmitDialog) {
// 				this.oSubmitDialog = new Dialog({
// 					type: DialogType.Message,
// 					title: "Select Team Seats",
// 					content: [
// 						new Label({
// 							text: "PleaseSelect the seats",
// 							labelFor: "submissionNote"
// 						}),
// 						new TextArea("submissionNote", {
// 							width: "100%",
// 							placeholder: "Add seats (required)",
// 							liveChange: function (oEvent) {
// 								var sText = oEvent.getParameter("value");
// 								this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
// 							}.bind(this)
// 						})
// 					],
// 					beginButton: new Button({
// 						type: ButtonType.Emphasized,
// 						text: "Submit",
// 						enabled: false,
// 						press: function () {
// 							var sText = Core.byId("submissionNote").getValue();
// 							MessageToast.show("Seats Are " + sText);
// 							this.oSubmitDialog.close();
// 						}.bind(this)
// 					}),
// 					endButton: new Button({
// 						text: "Cancel",
// 						press: function () {
// 							this.oSubmitDialog.close();
// 						}.bind(this)
// 					})
// 				});
// 			}

// 			this.oSubmitDialog.open();
// 		},

// 	});
// });