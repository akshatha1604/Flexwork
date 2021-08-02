using AdminService as service from '../../srv/service';

annotate service.SAPOfficeData // header-level annotations
{
    locationID   @title : 'Location ID';
    country_code @title : 'Country';
    city         @title : 'City';
    office       @title : 'Office';
    office_ID    @title : 'Office';
    block        @title : 'Block';
    floor        @title : 'Floor';
    totalSeat    @title : 'Total Seat';
}

annotate service.SAPOfficeData with @( // header-level annotations

    UI.HeaderInfo      : {
        TypeName       : 'Location',
        TypeNamePlural : 'Locations',
        Title          : {Value : locationID}
    },

    UI.SelectionFields : [
        country_code,
        city_ID,
        office_ID,
        block,
        floor
    ],
    UI.LineItem        : [
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.acceptTravel',   Label  : '{i18n>AcceptTravel}'   },
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.rejectTravel',   Label  : '{i18n>RejectTravel}'   },
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.deductDiscount', Label  : '{i18n>DeductDiscount}' },
        {Value : locationID},
        {Value : country_code},
        {Value : city_ID},
        {Value : office_ID},
        {Value : block},
        {Value : floor},
        {Value : totalSeat}
    ],


    UI.Identification  : [
        {
            $Type             : 'UI.DataField',
            Value             : locationID,
            ![@UI.Importance] : #High
        },
        {
            $Type : 'UI.DataField',
            Value : country_code
        },
        {
            $Type             : 'UI.DataField',
            Value             : city_ID,
            ![@UI.Importance] : #High,
            Label             : 'City'
        },
        {
            $Type             : 'UI.DataField',
            Value             : office_ID,
            ![@UI.Importance] : #High,
            Label             : 'Office'
        },
        {
            $Type             : 'UI.DataField',
            Value             : block,
            ![@UI.Importance] : #High

        },
        {
            $Type             : 'UI.DataField',
            Value             : floor,
            ![@UI.Importance] : #High
        },
        {
            $Type             : 'UI.DataField',
            Value             : totalSeat,
            ![@UI.Importance] : #High,

        }
    ],

    UI.Facets          : [
        //First facet for self..
        {
            $Type  : 'UI.CollectionFacet',
            Label  : 'Location',
            ID     : 'Location',
            Facets : [{
                $Type  : 'UI.ReferenceFacet',
                Target : '@UI.Identification',
                Label  : 'Location'
            }]
        },
        // 2nd facet for teams.
        {
            $Type  : 'UI.ReferenceFacet',
            Target : 'Teams/@UI.LineItem',
            Label  : 'Teams'
        }
    ]
);


annotate service.Teams // header-level annotations
{
    teamID         @title : 'Team ID';
    teamName       @title : 'Team Name';
    manager        @title : 'Manager Name';
    employeeCount  @title : 'Team Count';
    maxSeatPercent @title : 'Max Seat Percent';
}

annotate service.Teams with @( // header-level annotations

    UI.HeaderInfo      : {
        TypeName       : 'Team Detail',
        TypeNamePlural : 'Team Details',
        Title          : {Value : teamID}
    },

    UI.SelectionFields : [
        teamID,
        teamName,
        manager_ID,
        employeeCount,
        maxSeatPercent
    ],
    UI.LineItem        : [
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.acceptTravel',   Label  : '{i18n>AcceptTravel}'   },
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.rejectTravel',   Label  : '{i18n>RejectTravel}'   },
        //   { $Type  : 'UI.DataFieldForAction', Action : 'TravelService.deductDiscount', Label  : '{i18n>DeductDiscount}' },
        {Value : teamID},
        {Value : teamName},
        {Value : manager_ID},
        {Value : employeeCount},
        {Value : maxSeatPercent}
    ],


    UI.Identification  : [
        {
            $Type             : 'UI.DataField',
            Value             : teamID,
            ![@UI.Importance] : #High
        },
        {
            $Type : 'UI.DataField',
            Value : teamName
        },
        {
            $Type             : 'UI.DataField',
            Value             : manager_ID,
            ![@UI.Importance] : #High,
            Label             : 'City'
        },
        {
            $Type             : 'UI.DataField',
            Value             : employeeCount,
            ![@UI.Importance] : #High,
            Label             : 'Office'
        },
        {
            $Type             : 'UI.DataField',
            Value             : maxSeatPercent,
            ![@UI.Importance] : #High

        }
    ],

    UI.Facets          : [
                          //First facet for self..
                         {
        $Type  : 'UI.CollectionFacet',
        Label  : 'Team Details',
        ID     : 'Teams',
        Facets : [{
            $Type  : 'UI.ReferenceFacet',
            Target : '@UI.Identification',
            Label  : 'Team Details'
        }]
        },
          // 2nd facet for seat details.
         {
            $Type  : 'UI.ReferenceFacet',
            Target : 'to_Seats/@UI.LineItem',
            Label  : 'Seat Detail'
        }]
);

annotate service.TeamSeatMapping // header-level annotations
{
    seatID @title : 'Seat No.';    
}

annotate service.TeamSeatMapping with @odata.draft.enabled;
annotate service.TeamSeatMapping with @( // header-level annotations

    UI.HeaderInfo      : {
        TypeName       : 'Team Seat Detail',
        TypeNamePlural : 'Team Seat Details',
        Title          : {Value : teamID}
    },

    UI.SelectionFields : [
        seatID,
        locationID,
        teamID,
        monitorCount,
        facility1,
        facility2,
        facility3
    ],

// Capabilities:{
        // odata.draft.enabled: true,
//   InsertRestrictions.Insertable: true,
//   UpdateRestrictions.Updatable: false,
//   DeleteRestrictions.Deletable: true,
// },
//   Capabilities.DeleteRestrictions : {  Deletable : true },
//     }
//  Capabilities.NavigationRestrictions : {
//     RestrictedProperties : [
//         {
//            NavigationProperty : to_Seats,
//             InsertRestrictions : {
//                 Insertable : true
//             }
//         }
//     ]
//   },

    UI.LineItem        : [
                              { $Type  : 'UI.DataFieldForAction',
                                Action : 'AdminService.addSeat', 
                                Label  : '{i18n>Add Seats}',
                                 },
                                // Visible, Enabled },
                          {Value : seatID}],

    // UI.Identification  : [
    //     {
    //         $Type             : 'UI.DataField',
    //         Value             : seatID,
    //         ![@UI.Importance] : #High
    //     },
    //     {
    //         $Type             : 'UI.DataField',
    //         Value             : monitorCount,
    //         ![@UI.Importance] : #High,
    //         Label             : 'No.Of Monitors'
    //     },
    //     {
    //         $Type             : 'UI.DataField',
    //         Value             : facility1,
    //         ![@UI.Importance] : #High,
    //         Label             : ' Phone Extension'
    //     },
    //     {
    //         $Type             : 'UI.DataField',
    //         Value             : facility2,
    //         ![@UI.Importance] : #High,
    //         Label             : 'Laptop Lock'
    //     },
    // ],
);
